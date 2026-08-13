import * as fs from 'fs';
import { EmailsService } from '../emails/emails.service';
export declare class BackupsService {
    private readonly emailsService;
    private readonly logger;
    private readonly backupsDir;
    constructor(emailsService: EmailsService);
    listBackups(): Promise<{
        filename: string;
        size: number;
        createdAt: Date;
    }[]>;
    generateBackup(): Promise<{
        filename: string;
        path: string;
    }>;
    deleteBackup(filename: string): Promise<{
        message: string;
    }>;
    getBackupFileStream(filename: string): Promise<{
        stream: fs.ReadStream;
        filepath: string;
    }>;
    sendBackupToEmail(filename: string, email?: string): Promise<{
        message: string;
    }>;
    handleDailyAutonomousBackup(): Promise<void>;
}
