import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { PublicSettingsController } from './public-settings.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SettingsService],
  controllers: [SettingsController, PublicSettingsController],
  exports: [SettingsService]
})
export class SettingsModule {}
