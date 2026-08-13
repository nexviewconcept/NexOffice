import { FinanceService } from './finance.service';
export declare class FinanceController {
    private readonly financeService;
    constructor(financeService: FinanceService);
    getReport(): Promise<{
        totalRevenue: number;
        totalExpenses: number;
        netBalance: number;
        currency: string;
    }>;
    createCategory(data: {
        name: string;
        description?: string;
    }): Promise<{
        id: string;
        name: string;
        description: string | null;
    }>;
    getCategories(): Promise<{
        id: string;
        name: string;
        description: string | null;
    }[]>;
    createExpense(data: any): Promise<{
        category: {
            id: string;
            name: string;
            description: string | null;
        };
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        paymentMethod: string;
        reference: string | null;
        expenseDate: Date;
        categoryId: string;
    }>;
    getExpenses(): Promise<({
        category: {
            id: string;
            name: string;
            description: string | null;
        };
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        paymentMethod: string;
        reference: string | null;
        expenseDate: Date;
        categoryId: string;
    })[]>;
    deleteExpense(id: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        paymentMethod: string;
        reference: string | null;
        expenseDate: Date;
        categoryId: string;
    }>;
}
