import { ClientsService } from './clients.service';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(createClientDto: any): Promise<{
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
    update(id: string, updateClientDto: any): Promise<{
        id: string;
        name: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        address: string | null;
        type: string | null;
    }>;
    remove(id: string): Promise<{
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
