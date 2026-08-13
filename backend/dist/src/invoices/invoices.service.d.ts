import { PrismaService } from '../prisma/prisma.service';
import { DocumentsService } from '../documents/documents.service';
export declare class InvoicesService {
    private prisma;
    private documents;
    constructor(prisma: PrismaService, documents: DocumentsService);
    createInvoice(data: any): Promise<{
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
        items: {
            id: string;
            description: string;
            total: number;
            quantity: number;
            unit: string | null;
            unitPrice: number;
            invoiceId: string;
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
        total: number;
        notes: string | null;
    }>;
    findAll(): Promise<({
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
    })[]>;
    findOne(id: string): Promise<{
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
        items: {
            id: string;
            description: string;
            total: number;
            quantity: number;
            unit: string | null;
            unitPrice: number;
            invoiceId: string;
        }[];
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
        total: number;
        notes: string | null;
    }>;
    generateInvoicePdf(id: string): Promise<Buffer<ArrayBufferLike>>;
    deleteInvoice(id: string): Promise<{
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
    }>;
}
