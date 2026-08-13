import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<Record<string, string>>;
    updateSettings(data: Record<string, string>): Promise<{
        message: string;
    }>;
}
