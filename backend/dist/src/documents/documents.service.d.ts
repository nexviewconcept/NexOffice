import { OnModuleDestroy } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { PrismaService } from '../prisma/prisma.service';
export declare class DocumentsService implements OnModuleDestroy {
    private prisma;
    private cachedLogo;
    private cachedBlankCert;
    private cachedMdSign;
    private cachedBrowser;
    constructor(prisma: PrismaService);
    onModuleDestroy(): Promise<void>;
    getLogoBase64(): string;
    getBlankCertBase64(): string;
    getMdSignBase64(): string;
    getBrowser(): Promise<puppeteer.Browser>;
    generatePdf(htmlContent: string, options?: puppeteer.PDFOptions): Promise<Buffer>;
    generateQrCode(text: string): Promise<string>;
    generateStaffId(staffId: string): Promise<Buffer>;
    generateStudentIdCard(studentId: string): Promise<Buffer>;
    verifyStaff(staffId: string): Promise<{
        isValid: boolean;
        name: string;
        designation: string | null;
        photoUrl: string | null;
        status: string;
    }>;
}
