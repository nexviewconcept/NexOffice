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
        notes: string | null;
        dueDate: Date | null;
        invoiceNumber: string;
        issueDate: Date;
        subtotal: number;
        total: number;
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
        notes: string | null;
        dueDate: Date | null;
        invoiceNumber: string;
        issueDate: Date;
        subtotal: number;
        total: number;
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
            amount: number;
            paymentMethod: string;
            receiptNumber: string;
            paymentDate: Date;
        }[];
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
    }>;
    downloadPdf(id: string, res: Response, action?: string): Promise<void>;
    sendEmail(id: string): Promise<{
        message: string;
    }>;
    deleteInvoice(id: string): Promise<{
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
    }>;
}
