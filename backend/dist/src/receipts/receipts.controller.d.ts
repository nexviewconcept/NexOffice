import { ReceiptsService } from './receipts.service';
import type { Response } from 'express';
export declare class ReceiptsController {
    private readonly receiptsService;
    constructor(receiptsService: ReceiptsService);
    create(data: any): Promise<{
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
    downloadPdf(id: string, res: Response, action?: string): Promise<void>;
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
