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
}
