import { WhatsappService } from './whatsapp.service';
export declare class WhatsappController {
    private readonly whatsappService;
    constructor(whatsappService: WhatsappService);
    getStatus(): {
        connected: boolean;
        qrCode: string | null;
    };
    logout(): Promise<{
        success: boolean;
    }>;
    sendMessage(body: {
        to: string;
        message: string;
    }): Promise<{
        success: boolean;
    }>;
}
