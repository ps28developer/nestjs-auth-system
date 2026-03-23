import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppVersion, AppVersionSchema } from './schemas/app-version.schema';
import { VersionService } from './version.service';
import { VersionController } from './version.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AppVersion.name, schema: AppVersionSchema },
    ]),
  ],
  controllers: [VersionController],
  providers: [VersionService],
  exports: [VersionService],
})
export class VersionModule {}
