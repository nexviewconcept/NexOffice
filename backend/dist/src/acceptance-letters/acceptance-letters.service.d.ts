import { PrismaService } from '../prisma/prisma.service';
import { DocumentsService } from '../documents/documents.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { EmailsService } from '../emails/emails.service';
export declare class AcceptanceLettersService {
    private prisma;
    private documentsService;
    private whatsappService;
    private emailsService;
    constructor(prisma: PrismaService, documentsService: DocumentsService, whatsappService: WhatsappService, emailsService: EmailsService);
    create(data: any, user: any): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        department: string;
        course: string;
        dateIssued: Date;
        studentName: string;
        matricNumber: string;
        recipientAddress: string;
        issuedBy: string | null;
        qrCodeUrl: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        department: string;
        course: string;
        dateIssued: Date;
        studentName: string;
        matricNumber: string;
        recipientAddress: string;
        issuedBy: string | null;
        qrCodeUrl: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        department: string;
        course: string;
        dateIssued: Date;
        studentName: string;
        matricNumber: string;
        recipientAddress: string;
        issuedBy: string | null;
        qrCodeUrl: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        department: string;
        course: string;
        dateIssued: Date;
        studentName: string;
        matricNumber: string;
        recipientAddress: string;
        issuedBy: string | null;
        qrCodeUrl: string | null;
    }>;
    generatePdf(id: string): Promise<Buffer<ArrayBufferLike>>;
    sendEmail(id: string, email: string): Promise<{
        success: boolean;
    }>;
    sendWhatsapp(id: string, phone: string): Promise<{
        success: boolean;
    }>;
}
