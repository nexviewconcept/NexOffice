import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    create(createItemDto: any): Promise<{
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
    update(id: string, updateItemDto: any): Promise<{
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
    transaction(id: string, data: any): Promise<[{
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
    getTransactions(id: string): Promise<{
        id: string;
        createdAt: Date;
        type: string;
        notes: string | null;
        quantity: number;
        itemId: string;
    }[]>;
}
