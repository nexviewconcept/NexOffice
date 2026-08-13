import { PrismaService } from '../prisma/prisma.service';
export declare class AuditService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getLogs(filters: {
        action?: string;
        entity?: string;
        userId?: string;
    }): Promise<({
        user: {
            email: string;
            staffProfile: {
                firstName: string;
                lastName: string;
            } | null;
        } | null;
    } & {
        id: string;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        ipAddress: string | null;
        timestamp: Date;
    })[]>;
    logAction(data: {
        userId?: string;
        action: string;
        entity: string;
        entityId?: string;
        ipAddress?: string;
    }): Promise<void>;
}
