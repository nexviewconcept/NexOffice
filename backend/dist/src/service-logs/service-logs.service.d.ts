import { PrismaService } from '../prisma/prisma.service';
export declare class ServiceLogsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: any): Promise<{
        performedBy: {
            email: string;
            staffProfile: {
                firstName: string;
                lastName: string;
            } | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        amount: number;
        paymentDate: Date;
        serviceType: string;
        customerName: string;
        customerPhone: string | null;
        paymentStatus: string;
        deviceUsed: string | null;
        performedById: string | null;
    }>;
    findAll(): Promise<({
        performedBy: {
            email: string;
            staffProfile: {
                firstName: string;
                lastName: string;
            } | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        amount: number;
        paymentDate: Date;
        serviceType: string;
        customerName: string;
        customerPhone: string | null;
        paymentStatus: string;
        deviceUsed: string | null;
        performedById: string | null;
    })[]>;
    update(id: string, data: any): Promise<{
        performedBy: {
            email: string;
            staffProfile: {
                firstName: string;
                lastName: string;
            } | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        amount: number;
        paymentDate: Date;
        serviceType: string;
        customerName: string;
        customerPhone: string | null;
        paymentStatus: string;
        deviceUsed: string | null;
        performedById: string | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        amount: number;
        paymentDate: Date;
        serviceType: string;
        customerName: string;
        customerPhone: string | null;
        paymentStatus: string;
        deviceUsed: string | null;
        performedById: string | null;
    }>;
}
