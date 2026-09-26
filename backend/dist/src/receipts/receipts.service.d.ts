import { PrismaService } from '../prisma/prisma.service';
import { DocumentsService } from '../documents/documents.service';
import { EmailsService } from '../emails/emails.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
export declare class ReceiptsService {
    private prisma;
    private documents;
    private emails;
    private whatsapp;
    constructor(prisma: PrismaService, documents: DocumentsService, emails: EmailsService, whatsapp: WhatsappService);
    createReceipt(data: any): Promise<{
        id: string;
        createdAt: Date;
        notes: string | null;
        invoiceId: string | null;
        receiptNumber: string;
        amount: number;
        paymentMethod: string;
        paymentDate: Date;
    }>;
    findAll(): Promise<({
        invoice: ({
            client: {
                id: string;
                name: string;
                email: string | null;
                createdAt: Date;
                updatedAt: Date;
                phone: string | null;
                address: string | null;
                type: string | null;
            };
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            clientId: string;
            invoiceNumber: string;
            issueDate: Date;
            dueDate: Date | null;
            subtotal: number;
            discount: number;
            total: number;
            notes: string | null;
        }) | null;
    } & {
        id: string;
        createdAt: Date;
        notes: string | null;
        invoiceId: string | null;
        receiptNumber: string;
        amount: number;
        paymentMethod: string;
        paymentDate: Date;
    })[]>;
    generateReceiptPdf(id: string): Promise<Buffer<ArrayBufferLike>>;
    sendReceiptEmail(id: string, customEmail?: string): Promise<{
        message: string;
    }>;
    sendWhatsappReceipt(id: string, customPhone?: string): Promise<{
        message: string;
    }>;
    updateReceipt(id: string, data: any): Promise<{
        invoice: ({
            receipts: {
                id: string;
                createdAt: Date;
                notes: string | null;
                invoiceId: string | null;
                receiptNumber: string;
                amount: number;
                paymentMethod: string;
                paymentDate: Date;
            }[];
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            clientId: string;
            invoiceNumber: string;
            issueDate: Date;
            dueDate: Date | null;
            subtotal: number;
            discount: number;
            total: number;
            notes: string | null;
        }) | null;
    } & {
        id: string;
        createdAt: Date;
        notes: string | null;
        invoiceId: string | null;
        receiptNumber: string;
        amount: number;
        paymentMethod: string;
        paymentDate: Date;
    }>;
    deleteReceipt(id: string): Promise<{
        message: string;
    }>;
}
