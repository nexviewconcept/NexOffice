import { FilesService } from './files.service';
import type { Response } from 'express';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    listFiles(req: any, folder?: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        folder: string;
        sharedWith: string | null;
        uploadedById: string | null;
    }[]>;
    uploadFile(req: any, file: Express.Multer.File, folder: string, description?: string, sharedWith?: string, compress?: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        folder: string;
        sharedWith: string | null;
        uploadedById: string | null;
    }>;
    downloadFile(id: string, res: Response): Promise<import("@nestjs/common").StreamableFile>;
    deleteFile(id: string): Promise<{
        success: boolean;
    }>;
}
