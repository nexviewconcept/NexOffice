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
exports.CertificatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const documents_service_1 = require("../documents/documents.service");
const emails_service_1 = require("../emails/emails.service");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
let CertificatesService = class CertificatesService {
    prisma;
    documents;
    emails;
    whatsapp;
    constructor(prisma, documents, emails, whatsapp) {
        this.prisma = prisma;
        this.documents = documents;
        this.emails = emails;
        this.whatsapp = whatsapp;
    }
    async createCertificate(data) {
        const shortId = Math.floor(100000 + Math.random() * 900000);
        return this.prisma.certificate.create({
            data: {
                ...data,
                certificateNumber: `NCL-${shortId}`
            }
        });
    }
    async listCertificates() {
        return this.prisma.certificate.findMany({
            orderBy: { issueDate: 'desc' }
        });
    }
    async updateCertificate(id, data) {
        return this.prisma.certificate.update({
            where: { id },
            data
        });
    }
    async generatePdf(id) {
        const cert = await this.prisma.certificate.findUnique({ where: { id } });
        if (!cert)
            throw new common_1.NotFoundException('Certificate not found');
        const verifyUrl = `https://nexviewconcept.com.ng/verify/cert/${cert.certificateNumber}`;
        const qrCode = await this.documents.generateQrCode(verifyUrl);
        const html = `
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            @page { margin: 0; size: A4 landscape; }
            body { 
              font-family: 'Montserrat', sans-serif; 
              margin: 0; 
              padding: 0; 
              width: 100vw;
              height: 100vh;
              background-image: url('${this.documents.getBlankCertBase64()}');
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
              position: relative;
              box-sizing: border-box;
            }
            .top-bar {
              position: absolute;
              top: 50px; left: 60px; right: 60px;
              display: flex; justify-content: space-between; align-items: flex-start;
            }
            .logo-container {
              display: flex; align-items: flex-start; gap: 10px;
            }
            .logo { height: 70px; }
            .rc-number { font-size: 14px; font-weight: 500; margin-top: 10px; }
            
            .contact-info {
              text-align: right; font-size: 14px; line-height: 1.5;
            }
            .contact-info span { color: #E50914; font-weight: 700; }
            
            .content-area {
              position: absolute;
              top: 190px; left: 0; right: 0;
              text-align: center;
              padding: 0 50px;
            }
            h1 { 
              font-size: 54px; 
              font-weight: 800; 
              color: #FF0000; 
              margin: 0 0 15px; 
            }
            .certify-text { 
              font-size: 22px; 
              font-weight: 400; 
              margin-bottom: 15px; 
            }
            .name-container {
              display: inline-block;
              border-bottom: 3px solid #FF0000;
              padding: 0 50px 10px;
              margin-bottom: 15px;
            }
            .name { 
              font-size: 48px; 
              font-weight: 800; 
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .custom-note {
              font-size: 20px;
              color: #444;
              margin-top: 10px;
              margin-bottom: 20px;
            }
            .reason { 
              font-size: 20px; 
              font-weight: 400; 
              line-height: 1.4;
              max-width: 800px;
              margin: 0 auto;
            }
            .date {
              font-size: 18px;
              font-weight: 600;
              margin-top: 10px;
            }
            .period {
              font-size: 18px;
              display: block;
              margin-top: 5px;
              color: #444;
            }
            .skills {
              font-size: 16px;
              margin-top: 8px;
              color: #555;
            }
            
            .bottom-area {
              position: absolute;
              bottom: 45px; left: 60px; right: 60px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            
            .date-block {
              text-align: left;
              min-width: 200px;
            }
            .date-label { font-size: 11px; text-transform: uppercase; color: #666; font-weight: 700; letter-spacing: 0.5px; }
            .date-val { font-size: 16px; font-weight: 700; color: #111; margin-top: 3px; }
            .cert-no { font-size: 12px; color: #666; margin-top: 4px; font-weight: 600; }

            .signature-block {
              text-align: center;
              width: 260px;
            }
            .signature-img {
              height: 70px;
              margin-bottom: -15px;
              position: relative;
              z-index: 10;
            }
            .sig-line {
              border-bottom: 2px solid #FF0000;
              width: 100%;
              margin-bottom: 6px;
            }
            .sig-text {
              font-size: 15px;
              font-weight: 700;
              color: #111;
            }
            
            .qr-block {
              background: #fff;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 8px;
              display: inline-block;
            }
            .qr { width: 105px; height: 105px; display: block; }
          </style>
        </head>
        <body>
          <div class="top-bar">
            <div class="logo-container">
              ${this.documents.getLogoBase64() ? `<img class="logo" src="${this.documents.getLogoBase64()}" alt="Nexview Logo" />` : ''}
              <div class="rc-number">RC: 8682929</div>
            </div>
            <div class="contact-info">
              <span>Visit Us:</span><br/>
              www.nexviewconcept.com.ng<br/>
              <span>Contact Us:</span><br/>
              info@nexviewconcept.com.ng
            </div>
          </div>
          
          <div class="content-area">
            <h1>Certificate of Completion</h1>
            <div class="certify-text">This is to proudly certify that</div>
            
            <div class="name-container">
              <div class="name">${cert.recipientName}</div>
            </div>
            
            ${cert.customNote ? `<div class="custom-note" style="${cert.isCustomNoteBold ? 'font-weight: 800;' : ''}">${cert.customNote}</div>` : ''}
            
            <div class="reason">
              has successfully fulfilled the requirements of the <strong>${cert.courseName}</strong>.<br/>
              <span class="period">
                From ${cert.startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                ${cert.endDate ? ` to ${cert.endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}
              </span>
              ${cert.skillsLearned ? `<div class="skills"><strong>Skills Acquired:</strong> ${cert.skillsLearned}</div>` : ''}
            </div>
          </div>
          
          <div class="bottom-area">
            <div class="date-block">
              <div class="date-label">Date of Issue</div>
              <div class="date-val">${cert.issueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <div class="cert-no">Certificate No: ${cert.certificateNumber}</div>
            </div>

            <div class="signature-block">
              ${this.documents.getMdSignBase64() ? `<img class="signature-img" src="${this.documents.getMdSignBase64()}" alt="Signature" />` : ''}
              <div class="sig-line"></div>
              <div class="sig-text">For: Managing Director</div>
            </div>
            
            <div class="qr-block">
              <img class="qr" src="${qrCode}" alt="Verification QR Code" />
            </div>
          </div>
        </body>
      </html>
    `;
        return this.documents.generatePdf(html, { landscape: true });
    }
    async emailCertificate(id, email) {
        const cert = await this.prisma.certificate.findUnique({ where: { id } });
        if (!cert)
            throw new common_1.NotFoundException('Certificate not found');
        const pdfBuffer = await this.generatePdf(id);
        const subject = `Your Certificate of Completion - ${cert.courseName}`;
        const text = `Dear ${cert.recipientName},\n\nCongratulations! Please find attached your Certificate of Completion for ${cert.courseName}.\n\nBest Regards,\nNexview Concept Limited`;
        const html = `<p>Dear ${cert.recipientName},</p><p>Congratulations! Please find attached your Certificate of Completion for <strong>${cert.courseName}</strong>.</p><p>Best Regards,<br/>Nexview Concept Limited</p>`;
        await this.emails.sendEmail(email, subject, html, undefined, 'info@nexviewconcept.com.ng', undefined, pdfBuffer, `Certificate_${cert.certificateNumber}.pdf`);
        return { message: 'Certificate sent successfully' };
    }
    async whatsappCertificate(id, phone) {
        const cert = await this.prisma.certificate.findUnique({ where: { id } });
        if (!cert)
            throw new common_1.NotFoundException('Certificate not found');
        const pdfBuffer = await this.generatePdf(id);
        const caption = `Dear ${cert.recipientName},\n\nCongratulations! Please find attached your Certificate of Completion for ${cert.courseName}.\n\nBest Regards,\nNexview Concept Limited`;
        await this.whatsapp.sendDocument(phone, pdfBuffer, `Certificate_${cert.certificateNumber}.pdf`, caption);
        return { message: 'Certificate sent via WhatsApp successfully' };
    }
};
exports.CertificatesService = CertificatesService;
exports.CertificatesService = CertificatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        documents_service_1.DocumentsService,
        emails_service_1.EmailsService,
        whatsapp_service_1.WhatsappService])
], CertificatesService);
//# sourceMappingURL=certificates.service.js.map