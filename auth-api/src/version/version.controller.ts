import {
  Controller,
  Get,
  Put,
  Body,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { VersionService } from './version.service';
import { UpdateVersionDto } from './dto/update-version.dto';

@Controller()
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  @Get('latest-version')
  async getLatestVersion(
    @Query('currentversion', new DefaultValuePipe('0.0.0'))
    currentVersion: string,
  ) {
    const data = await this.versionService.checkUpdate(currentVersion);
    return {
      status: 'success',
      data,
    };
  }

  @Put('latest-version')
  async updateLatestVersion(@Body() dto: UpdateVersionDto) {
    const doc = await this.versionService.setLatestVersion(dto.latestVersion);
    return {
      status: 'success',
      data: {
        latestVersion: doc.latestVersion,
      },
    };
  }
}
