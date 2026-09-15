import { PrismaService } from '../prisma/prisma.service';
import { TicketsService } from '../tickets/tickets.service';
export declare class CorporateService {
    private prisma;
    private ticketsService;
    constructor(prisma: PrismaService, ticketsService: TicketsService);
    getCatalogue(): Promise<{
        enabled: boolean;
        id: string;
        name: string;
        description: string;
    }[]>;
    createOrder(data: {
        fullName: string;
        email: string;
        phone: string;
        serviceId: string;
        description: string;
        idempotencyKey: string;
    }): Promise<{
        success: boolean;
        message: string;
        ticketNumber: string;
    }>;
    createInquiry(data: {
        fullName: string;
        email: string;
        phone: string;
        subject: string;
        message: string;
        idempotencyKey: string;
    }): Promise<{
        success: boolean;
        message: string;
        ticketNumber: string;
    }>;
}
