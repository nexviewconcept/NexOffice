import { PrismaService } from '../prisma/prisma.service';
import { DocumentsService } from '../documents/documents.service';
import { EmailsService } from '../emails/emails.service';
export declare class ReceiptsService {
    private prisma;
    private documents;
    private emails;
    constructor(prisma: PrismaService, documents: DocumentsService, emails: EmailsService);
    createReceipt(data: any): Promise<{
        id: string;
        createdAt: Date;
        notes: string | null;
        invoiceId: string | null;
        amount: number;
        paymentMethod: string;
        receiptNumber: string;
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
            notes: string | null;
            dueDate: Date | null;
            invoiceNumber: string;
            issueDate: Date;
            subtotal: number;
            total: number;
        }) | null;
    } & {
        id: string;
        createdAt: Date;
        notes: string | null;
        invoiceId: string | null;
        amount: number;
        paymentMethod: string;
        receiptNumber: string;
        paymentDate: Date;
    })[]>;
    generateReceiptPdf(id: string): Promise<Buffer<ArrayBufferLike>>;
    sendReceiptEmail(id: string): Promise<{
        message: string;
    }>;
    deleteReceipt(id: string): Promise<{
        id: string;
        createdAt: Date;
        notes: string | null;
        invoiceId: string | null;
        amount: number;
        paymentMethod: string;
        receiptNumber: string;
        paymentDate: Date;
    }>;
}
