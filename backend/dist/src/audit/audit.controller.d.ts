import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    getLogs(action?: string, entity?: string, userId?: string): Promise<({
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
}
