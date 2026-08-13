import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getOverview(): Promise<{
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
