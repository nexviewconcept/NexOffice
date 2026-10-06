import { DocumentsService } from './documents.service';
import type { Response } from 'express';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    downloadStaffId(id: string, res: Response): Promise<void>;
    verifyStaff(id: string): Promise<{
        isValid: boolean;
        name: string;
        designation: string | null;
        photoUrl: string | null;
        status: string;
    }>;
    createCustomLetter(body: {
        recipient: string;
        subject: string;
        content: string;
    }, res: Response): Promise<void>;
    verifyDocument(id: string): Promise<{
        id: string;
        subject: string;
        recipient: string;
        content: string;
        dateIssued: Date;
    }>;
    compressPdfFile(file: Express.Multer.File, res: Response): Promise<void>;
}
