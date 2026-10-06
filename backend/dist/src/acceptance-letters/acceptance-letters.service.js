"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptanceLettersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const documents_service_1 = require("../documents/documents.service");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
const emails_service_1 = require("../emails/emails.service");
let AcceptanceLettersService = class AcceptanceLettersService {
    prisma;
    documentsService;
    whatsappService;
    emailsService;
    constructor(prisma, documentsService, whatsappService, emailsService) {
        this.prisma = prisma;
        this.documentsService = documentsService;
        this.whatsappService = whatsappService;
        this.emailsService = emailsService;
    }
    async create(data, user) {
        const letter = await this.prisma.acceptanceLetter.create({
            data: {
                studentName: data.studentName,
                matricNumber: data.matricNumber,
                department: data.department,
                course: data.course,
                recipientAddress: data.recipientAddress,
                issuedBy: user.id,
            },
        });
        const qrCodeUrl = await this.documentsService.generateQrCode(`https://nexviewconcept.com.ng/verify-letter/${letter.id}`);
        await this.prisma.acceptanceLetter.update({
            where: { id: letter.id },
            data: { qrCodeUrl },
        });
        return letter;
    }
    async findAll() {
        return this.prisma.acceptanceLetter.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const letter = await this.prisma.acceptanceLetter.findUnique({
            where: { id },
        });
        if (!letter)
            throw new common_1.NotFoundException('Letter not found');
        return letter;
    }
    async remove(id) {
        return this.prisma.acceptanceLetter.delete({ where: { id } });
    }
    async generatePdf(id) {
        const letter = await this.findOne(id);
        const lh = await this.prisma.systemSetting.findUnique({ where: { key: 'letterhead' } });
        const sig = await this.prisma.systemSetting.findUnique({ where: { key: 'signature' } });
        const letterheadUrl = lh?.value;
        const signatureUrl = sig?.value;
        if (!letterheadUrl || !signatureUrl) {
            throw new common_1.BadRequestException('System letterhead or signature not configured.');
        }
        const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          padding: 40px;
          position: relative;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .header img {
          max-width: 100%;
          height: auto;
          max-height: 150px;
        }
        .date {
          text-align: right;
          margin-bottom: 20px;
          font-weight: bold;
        }
        .recipient {
          margin-bottom: 30px;
          white-space: pre-line;
          font-weight: bold;
        }
        .title {
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          text-decoration: underline;
          margin-bottom: 30px;
        }
        .content {
          line-height: 1.6;
          text-align: justify;
        }
        .content p {
          margin-bottom: 15px;
        }
        .footer {
          margin-top: 50px;
        }
        .signature {
          max-width: 150px;
          max-height: 80px;
          margin-bottom: 10px;
        }
        .qr-code {
          position: absolute;
          bottom: 40px;
          right: 40px;
          width: 100px;
          height: 100px;
        }
        .disclaimer {
          position: absolute;
          bottom: 20px;
          left: 40px;
          font-size: 10px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${letterheadUrl}" alt="Letterhead" />
        </div>
        
        <div class="date">
          Date: ${new Date(letter.dateIssued).toLocaleDateString('en-GB')}
        </div>

        <div class="recipient">
          The Head of Department,<br/>
          ${letter.department},<br/>
          ${letter.recipientAddress}
        </div>

        <div class="title">
          ACCEPTANCE FOR INDUSTRIAL TRAINING
        </div>

        <div class="content">
          <p>Dear Sir/Madam,</p>
          <p>This is to formally notify you that we have accepted <b>${letter.studentName.toUpperCase()}</b>, a student of your institution with Registration/Matric Number <b>${letter.matricNumber}</b>, for the mandatory Students Industrial Work Experience Scheme (SIWES) / Industrial Training at our organization.</p>
          
          <p>The student will be engaged in practical work and training relevant to the course of study (<b>${letter.course}</b>) for the stipulated period.</p>
          
          <p>We assure you that the student will receive adequate supervision and guidance throughout the duration of the training.</p>
          
          <p>Thank you.</p>
        </div>

        <div class="footer">
          <p>Yours faithfully,</p>
          <img class="signature" src="${signatureUrl}" alt="Signature" />
          <p><b>MD/CEO</b><br/>Nexview Concept</p>
        </div>

        ${letter.qrCodeUrl ? `<img class="qr-code" src="${letter.qrCodeUrl}" alt="QR Code" />` : ''}
        
        <div class="disclaimer">
          Scan the QR Code to verify the authenticity of this letter.<br/>
          Document Ref: ${letter.id.split('-')[0].toUpperCase()}
        </div>
      </div>
    </body>
    </html>
    `;
        return this.documentsService.generatePdf(htmlContent);
    }
    async sendEmail(id, email) {
        const letter = await this.findOne(id);
        const pdfBuffer = await this.generatePdf(id);
        try {
            await this.emailsService.sendEmail(email, 'IT Acceptance Letter - Nexview Concept', undefined, undefined, 'info@nexviewconcept.com.ng', `Dear ${letter.studentName},\n\nPlease find attached your IT Acceptance Letter.\n\nBest regards,\nNexview Concept`, pdfBuffer, `Acceptance_Letter_${letter.matricNumber}.pdf`);
            return { success: true };
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('Failed to send email');
        }
    }
    async sendWhatsapp(id, phone) {
        const letter = await this.findOne(id);
        const pdfBuffer = await this.generatePdf(id);
        try {
            await this.whatsappService.sendDocument(phone, pdfBuffer, `Acceptance_Letter_${letter.matricNumber}.pdf`, `Hello ${letter.studentName}, here is your IT Acceptance Letter from Nexview Concept.`);
            return { success: true };
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('Failed to send WhatsApp message');
        }
    }
};
exports.AcceptanceLettersService = AcceptanceLettersService;
exports.AcceptanceLettersService = AcceptanceLettersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        documents_service_1.DocumentsService,
        whatsapp_service_1.WhatsappService,
        emails_service_1.EmailsService])
], AcceptanceLettersService);
//# sourceMappingURL=acceptance-letters.service.js.map