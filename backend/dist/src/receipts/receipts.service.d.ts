import { PrismaService } from '../prisma/prisma.service';
import { DocumentsService } from '../documents/documents.service';
export declare class ReceiptsService {
    private prisma;
    private documents;
    constructor(prisma: PrismaService, documents: DocumentsService);
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
    deleteReceipt(id: string): Promise<{
        id: string;
        createdAt: Date;
        notes: string | null;
        invoiceId: string | null;
        receiptNumber: string;
        amount: number;
        paymentMethod: string;
        paymentDate: Date;
    }>;
}
