import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  // Default values to initialize if not present
  private readonly defaultSettings = {
    'companyName': 'Nexview Concept Limited',
    'companyAddress': 'Abuja, Nigeria',
    'currency': 'NGN',
    'supportEmail': 'support@nexview.com',
    'supportPhone': '+234 800 000 0000',
  };

  constructor(private prisma: PrismaService) {}

  async getSettings() {
    const records = await this.prisma.systemSetting.findMany();
    
    // Convert to key-value object
    let settings: Record<string, string> = {};
    records.forEach(r => {
      settings[r.key] = r.value;
    });

    // Check for missing defaults and insert them
    let missingDefaults = false;
    for (const [key, value] of Object.entries(this.defaultSettings)) {
      if (!settings[key]) {
        settings[key] = value;
        missingDefaults = true;
      }
    }

    if (missingDefaults) {
      await this.updateSettings(settings); // Bulk upsert missing
    }

    return settings;
  }

  async updateSettings(data: Record<string, string>) {
    const promises = Object.entries(data).map(([key, value]) => {
      return this.prisma.systemSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      });
    });

    await Promise.all(promises);
    return { message: 'Settings updated successfully' };
  }
}
