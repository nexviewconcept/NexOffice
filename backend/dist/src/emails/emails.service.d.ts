import { PrismaService } from '../prisma/prisma.service';
export declare class EmailsService {
    private prisma;
    private readonly logger;
    private transporter;
    constructor(prisma: PrismaService);
    getLogs(): Promise<{
        id: string;
        status: string;
        subject: string;
        recipient: string;
        template: string | null;
        sentAt: Date;
    }[]>;
    sendEmail(recipient: string, subject: string, template?: string, attachmentPath?: string, senderEmail?: string, bodyText?: string): Promise<{
        message: string;
        logId: string;
    }>;
    retryEmail(id: string): Promise<{
        message: string;
    }>;
}
