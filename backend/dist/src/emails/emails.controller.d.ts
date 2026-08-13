import { EmailsService } from './emails.service';
export declare class EmailsController {
    private readonly emailsService;
    constructor(emailsService: EmailsService);
    getLogs(): Promise<{
        id: string;
        status: string;
        subject: string;
        recipient: string;
        template: string | null;
        sentAt: Date;
    }[]>;
    sendCustomEmail(data: {
        recipient: string;
        subject: string;
        body?: string;
        senderEmail?: string;
        template?: string;
    }): Promise<{
        message: string;
        logId: string;
    }>;
    sendTestEmail(data: {
        recipient: string;
        subject: string;
        template?: string;
        senderEmail?: string;
        body?: string;
    }): Promise<{
        message: string;
        logId: string;
    }>;
    retryEmail(id: string): Promise<{
        message: string;
    }>;
}
