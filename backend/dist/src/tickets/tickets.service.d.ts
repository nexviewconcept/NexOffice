import { PrismaService } from '../prisma/prisma.service';
import { EmailsService } from '../emails/emails.service';
export declare class TicketsService {
    private prisma;
    private emailsService;
    constructor(prisma: PrismaService, emailsService: EmailsService);
    createTicket(userId: string, data: any): Promise<{
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
    getTickets(userId?: string): Promise<({
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
    getTicketById(id: string): Promise<{
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
    addMessage(ticketId: string, userId: string, message: string, isSuperAdmin: boolean): Promise<{
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
