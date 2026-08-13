import { TicketsService } from './tickets.service';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    create(req: any, data: any): Promise<{
        user: {
            id: string;
            email: string;
            notificationEmail: string | null;
            passwordHash: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        subject: string;
        priority: string;
        category: string;
        ticketNumber: string;
    }>;
    getAll(req: any): Promise<({
        user: {
            email: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        subject: string;
        priority: string;
        category: string;
        ticketNumber: string;
    })[]>;
    getById(id: string): Promise<{
        user: {
            email: string;
        };
        messages: ({
            user: {
                email: string;
                staffProfile: {
                    firstName: string;
                    lastName: string;
                } | null;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            message: string;
            isStaff: boolean;
            ticketId: string;
        })[];
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        subject: string;
        priority: string;
        category: string;
        ticketNumber: string;
    }>;
    reply(req: any, id: string, message: string): Promise<{
        user: {
            email: string;
            staffProfile: {
                firstName: string;
                lastName: string;
            } | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        isStaff: boolean;
        ticketId: string;
    }>;
    updateStatus(id: string, status: string): Promise<{
        user: {
            id: string;
            email: string;
            notificationEmail: string | null;
            passwordHash: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        subject: string;
        priority: string;
        category: string;
        ticketNumber: string;
    }>;
}
