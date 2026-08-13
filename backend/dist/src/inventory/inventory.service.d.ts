import { PrismaService } from '../prisma/prisma.service';
export declare class InventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    createItem(data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        sku: string;
        category: string;
        minQuantity: number;
        location: string | null;
        condition: string | null;
        purchaseCost: number | null;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        sku: string;
        category: string;
        minQuantity: number;
        location: string | null;
        condition: string | null;
        purchaseCost: number | null;
    }[]>;
    updateItem(id: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        sku: string;
        category: string;
        minQuantity: number;
        location: string | null;
        condition: string | null;
        purchaseCost: number | null;
    }>;
    recordTransaction(itemId: string, data: any): Promise<[{
        id: string;
        createdAt: Date;
        type: string;
        notes: string | null;
        quantity: number;
        itemId: string;
    }, {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        sku: string;
        category: string;
        minQuantity: number;
        location: string | null;
        condition: string | null;
        purchaseCost: number | null;
    }]>;
    getTransactions(itemId: string): Promise<{
        id: string;
        createdAt: Date;
        type: string;
        notes: string | null;
        quantity: number;
        itemId: string;
    }[]>;
}
