import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private prisma;
    private readonly logger;
    private readonly defaultSettings;
    constructor(prisma: PrismaService);
    getSettings(): Promise<Record<string, string>>;
    updateSettings(data: Record<string, string>): Promise<{
        message: string;
    }>;
}
