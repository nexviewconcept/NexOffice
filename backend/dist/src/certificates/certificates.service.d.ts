import { PrismaService } from '../prisma/prisma.service';
import { DocumentsService } from '../documents/documents.service';
export declare class CertificatesService {
    private prisma;
    private documents;
    constructor(prisma: PrismaService, documents: DocumentsService);
    createCertificate(data: any): Promise<{
        id: string;
        status: string;
        issueDate: Date;
        certificateNumber: string;
        recipientName: string;
        courseName: string;
        skillsLearned: string | null;
        startDate: Date;
        endDate: Date | null;
        staffId: string | null;
    }>;
    listCertificates(): Promise<{
        id: string;
        status: string;
        issueDate: Date;
        certificateNumber: string;
        recipientName: string;
        courseName: string;
        skillsLearned: string | null;
        startDate: Date;
        endDate: Date | null;
        staffId: string | null;
    }[]>;
    generatePdf(id: string): Promise<Buffer<ArrayBufferLike>>;
}
