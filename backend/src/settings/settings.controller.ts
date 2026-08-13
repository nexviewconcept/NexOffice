import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Get()
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR')
  @Put()
  updateSettings(@Body() data: Record<string, string>) {
    return this.settingsService.updateSettings(data);
  }
}
