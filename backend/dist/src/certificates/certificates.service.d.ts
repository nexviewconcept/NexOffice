import { PrismaService } from '../prisma/prisma.service';
import { DocumentsService } from '../documents/documents.service';
import { EmailsService } from '../emails/emails.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
export declare class CertificatesService {
    private prisma;
    private documents;
    private emails;
    private whatsapp;
    constructor(prisma: PrismaService, documents: DocumentsService, emails: EmailsService, whatsapp: WhatsappService);
    createCertificate(data: any): Promise<{
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
    listCertificates(): Promise<{
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
    updateCertificate(id: string, data: any): Promise<{
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
    generatePdf(id: string): Promise<Buffer<ArrayBufferLike>>;
    emailCertificate(id: string, email: string): Promise<{
        message: string;
    }>;
    whatsappCertificate(id: string, phone: string): Promise<{
        message: string;
    }>;
}
