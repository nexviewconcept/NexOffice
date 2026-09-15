import { CorporateService } from './corporate.service';
export declare class CorporateController {
    private readonly corporateService;
    constructor(corporateService: CorporateService);
    getServices(): Promise<{
        enabled: boolean;
        id: string;
        name: string;
        description: string;
    }[]>;
    createOrder(body: {
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
    createInquiry(body: {
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
