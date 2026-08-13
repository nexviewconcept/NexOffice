import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getOverviewStats(): Promise<{
        totalStaff: number;
        pendingInvoices: number;
        lowInventory: number;
        certificatesIssued: number;
        recentActivity: {
            id: string;
            action: string;
            entity: string;
            user: string;
            timestamp: Date;
        }[];
    }>;
}
