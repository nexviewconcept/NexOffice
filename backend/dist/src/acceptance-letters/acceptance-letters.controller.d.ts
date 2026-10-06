import { AcceptanceLettersService } from './acceptance-letters.service';
export declare class AcceptanceLettersController {
    private readonly acceptanceLettersService;
    constructor(acceptanceLettersService: AcceptanceLettersService);
    create(data: any, req: any): Promise<{
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
    getPdf(id: string, res: any): Promise<void>;
    sendEmail(id: string, email: string): Promise<{
        success: boolean;
    }>;
    sendWhatsapp(id: string, phone: string): Promise<{
        success: boolean;
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
}
