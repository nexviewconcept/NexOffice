import { CertificatesService } from './certificates.service';
import type { Response } from 'express';
export declare class CertificatesController {
    private readonly certificatesService;
    constructor(certificatesService: CertificatesService);
    create(data: any): Promise<{
        id: string;
        status: string;
        issueDate: Date;
        certificateNumber: string;
        recipientName: string;
        courseName: string;
        skillsLearned: string | null;
        startDate: Date;
        endDate: Date | null;
        staffId: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        status: string;
        issueDate: Date;
        certificateNumber: string;
        recipientName: string;
        courseName: string;
        skillsLearned: string | null;
        startDate: Date;
        endDate: Date | null;
        staffId: string | null;
    }[]>;
    downloadPdf(id: string, res: Response, action?: string): Promise<void>;
}
