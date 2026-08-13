import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    sendEmail(to: string, subject: string, template: string, context: any): Promise<void>;
    logAudit(userId: string | null, action: string, entity: string, entityId?: string | null, ipAddress?: string | null): Promise<void>;
    createAnnouncement(data: any, userId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        audience: string;
        startDate: Date;
        title: string;
        message: string;
        recurrence: string;
        channel: string;
        repeatEmail: boolean;
        expiryDate: Date | null;
        createdBy: string | null;
    }>;
    getAllAnnouncements(): Promise<({
        _count: {
            occurrences: number;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        audience: string;
        startDate: Date;
        title: string;
        message: string;
        recurrence: string;
        channel: string;
        repeatEmail: boolean;
        expiryDate: Date | null;
        createdBy: string | null;
    })[]>;
    updateAnnouncementStatus(id: string, status: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        audience: string;
        startDate: Date;
        title: string;
        message: string;
        recurrence: string;
        channel: string;
        repeatEmail: boolean;
        expiryDate: Date | null;
        createdBy: string | null;
    }>;
    evaluateAnnouncements(): Promise<void>;
    private checkRecurrence;
    getMyFeed(userId: string): Promise<{
        id: string;
        title: string;
        message: string;
        audience: string;
        firedAt: Date;
        isRead: boolean;
    }[]>;
    markAsRead(occurrenceId: string, userId: string): Promise<{
        success: boolean;
    }>;
}
