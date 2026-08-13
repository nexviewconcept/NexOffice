import { Controller, Get } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('api/v1/public/settings')
export class PublicSettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings() {
    const settings = await this.settingsService.getSettings();
    return {
      faviconUrl: settings.faviconUrl || '',
      companyName: settings.companyName || ''
    };
  }
}
