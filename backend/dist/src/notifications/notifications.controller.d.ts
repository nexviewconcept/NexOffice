import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    createAnnouncement(data: any, req: any): Promise<{
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
    getMyFeed(req: any): Promise<{
        id: string;
        title: string;
        message: string;
        audience: string;
        firedAt: Date;
        isRead: boolean;
    }[]>;
    markAsRead(occurrenceId: string, req: any): Promise<{
        success: boolean;
    }>;
}
