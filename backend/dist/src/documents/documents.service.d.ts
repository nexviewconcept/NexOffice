import * as puppeteer from 'puppeteer';
import { PrismaService } from '../prisma/prisma.service';
export declare class DocumentsService {
    private prisma;
    private cachedLogo;
    private cachedBlankCert;
    private cachedMdSign;
    constructor(prisma: PrismaService);
    getLogoBase64(): string;
    getBlankCertBase64(): string;
    getMdSignBase64(): string;
    generatePdf(htmlContent: string, options?: puppeteer.PDFOptions): Promise<Buffer>;
    generateQrCode(text: string): Promise<string>;
    generateStaffId(staffId: string): Promise<Buffer>;
    verifyStaff(staffId: string): Promise<{
        isValid: boolean;
        name: string;
        designation: string | null;
        photoUrl: string | null;
        status: string;
    }>;
}
