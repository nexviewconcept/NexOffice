import { PrismaService } from '../prisma/prisma.service';
export declare class PublicVerificationController {
    private prisma;
    constructor(prisma: PrismaService);
    verifyStaff(idNumber: string): Promise<{
        staffIdNumber: string | null;
        firstName: string;
        lastName: string;
        designation: string | null;
        photoUrl: string | null;
        status: string;
    }>;
    verifyReceipt(receiptNumber: string): Promise<{
        receiptNumber: string;
        amount: number;
        paymentDate: Date;
        paymentMethod: string;
        clientName: string;
        invoiceNumber: string;
    }>;
    verifyCert(certNumber: string): Promise<{
        certificateNumber: string;
        recipientName: string;
        courseName: string;
        issueDate: Date;
    }>;
    verifyInvoice(invoiceNumber: string): Promise<{
        invoiceNumber: string;
        total: number;
        subtotal: number;
        issueDate: Date;
        dueDate: Date | null;
        status: string;
        clientName: string;
    }>;
}
