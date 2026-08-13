import { SettingsService } from './settings.service';
export declare class PublicSettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<{
        faviconUrl: string;
        companyName: string;
    }>;
}
