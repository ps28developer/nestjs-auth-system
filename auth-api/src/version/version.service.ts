import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppVersion, AppVersionDocument } from './schemas/app-version.schema';

const DEFAULT_APP_KEY = 'app';

/**
 * Compare two semantic versions (e.g. 1.1.76 vs 1.1.80).
 * Returns: negative if a < b, 0 if equal, positive if a > b.
 */
function compareVersions(a: string, b: string): number {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);
  const len = Math.max(partsA.length, partsB.length);
  for (let i = 0; i < len; i++) {
    const numA = partsA[i] ?? 0;
    const numB = partsB[i] ?? 0;
    if (numA !== numB) return numA - numB;
  }
  return 0;
}

@Injectable()
export class VersionService {
  constructor(
    @InjectModel(AppVersion.name)
    private readonly appVersionModel: Model<AppVersionDocument>,
  ) {}

  async getLatestVersion(key: string = DEFAULT_APP_KEY): Promise<string | null> {
    const doc = await this.appVersionModel.findOne({ key }).exec();
    return doc?.latestVersion ?? null;
  }

  async checkUpdate(currentVersion: string): Promise<{
    currentVersion: string;
    appUpdateRequired: boolean;
  }> {
    const latest = await this.getLatestVersion();
    const appUpdateRequired =
      latest !== null && compareVersions(currentVersion, latest) < 0;
    return {
      currentVersion,
      appUpdateRequired,
    };
  }

  async setLatestVersion(
    latestVersion: string,
    key: string = DEFAULT_APP_KEY,
  ): Promise<AppVersionDocument> {
    const doc = await this.appVersionModel
      .findOneAndUpdate(
        { key },
        { latestVersion },
        { new: true, upsert: true },
      )
      .exec();
    return doc!;
  }
}
