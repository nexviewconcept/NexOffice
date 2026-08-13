import { InvoicesService } from './invoices.service';
import type { Response } from 'express';
export declare class InvoicesController {
    private readonly invoicesService;
    constructor(invoicesService: InvoicesService);
    create(data: any): Promise<{
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
    downloadPdf(id: string, res: Response, action?: string): Promise<void>;
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
