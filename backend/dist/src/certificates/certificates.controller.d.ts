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
        customNote: string | null;
        isCustomNoteBold: boolean;
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
        customNote: string | null;
        isCustomNoteBold: boolean;
        startDate: Date;
        endDate: Date | null;
        staffId: string | null;
    }[]>;
    update(id: string, data: any): Promise<{
        id: string;
        status: string;
        issueDate: Date;
        certificateNumber: string;
        recipientName: string;
        courseName: string;
        skillsLearned: string | null;
        customNote: string | null;
        isCustomNoteBold: boolean;
        startDate: Date;
        endDate: Date | null;
        staffId: string | null;
    }>;
    downloadPdf(id: string, res: Response, action?: string): Promise<void>;
    emailCertificate(id: string, email: string): Promise<{
        message: string;
    }>;
    whatsappCertificate(id: string, phone: string): Promise<{
        message: string;
    }>;
}
