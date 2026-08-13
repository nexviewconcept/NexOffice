import { PrismaService } from '../prisma/prisma.service';
export declare class ClientsService {
    private prisma;
    constructor(prisma: PrismaService);
    createClient(data: any): Promise<{
        id: string;
        name: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        address: string | null;
        type: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        address: string | null;
        type: string | null;
    }[]>;
    findOne(id: string): Promise<{
        invoices: {
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
        }[];
    } & {
        id: string;
        name: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        address: string | null;
        type: string | null;
    }>;
    updateClient(id: string, data: any): Promise<{
        id: string;
        name: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        address: string | null;
        type: string | null;
    }>;
    deleteClient(id: string): Promise<{
        id: string;
        name: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        address: string | null;
        type: string | null;
    }>;
}
