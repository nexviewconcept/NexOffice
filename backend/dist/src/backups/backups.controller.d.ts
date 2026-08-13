import { BackupsService } from './backups.service';
import type { Response } from 'express';
import * as fs from 'fs';
export declare class BackupsController {
    private readonly backupsService;
    constructor(backupsService: BackupsService);
    listBackups(): Promise<{
        filename: string;
        size: number;
        createdAt: Date;
    }[]>;
    createBackup(): Promise<{
        filename: string;
        path: string;
    }>;
    emailBackup(filename: string): Promise<{
        message: string;
    }>;
    deleteBackup(filename: string): Promise<{
        message: string;
    }>;
    downloadBackup(filename: string, res: Response): Promise<fs.ReadStream>;
}
