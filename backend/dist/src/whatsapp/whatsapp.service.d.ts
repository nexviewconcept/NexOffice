import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
export declare class WhatsappService implements OnModuleInit, OnModuleDestroy {
    private readonly logger;
    private sock;
    private qrCodeDataUrl;
    private isConnected;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    connectToWhatsApp(): Promise<void>;
    getStatus(): {
        connected: boolean;
        qrCode: string | null;
    };
    logout(): Promise<{
        success: boolean;
    }>;
    sendMessage(to: string, message: string): Promise<{
        success: boolean;
    }>;
    sendDocument(to: string, documentBuffer: Buffer, fileName: string, caption?: string): Promise<{
        success: boolean;
    }>;
}
