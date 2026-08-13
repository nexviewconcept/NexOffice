import { StreamableFile } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
export declare class FilesService {
    private prisma;
    private readonly logger;
    private readonly uploadDir;
    constructor(prisma: PrismaService);
    uploadFile(file: Express.Multer.File, folder: string, description?: string, userId?: string, sharedWith?: string, shouldCompress?: string | boolean): Promise<{
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
    listFiles(folder?: string, userId?: string, userEmail?: string, isSuperAdmin?: boolean): Promise<{
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
    getFileStream(id: string): Promise<{
        stream: StreamableFile;
        mimeType: string;
        originalName: string;
    }>;
    deleteFile(id: string): Promise<{
        success: boolean;
    }>;
}
