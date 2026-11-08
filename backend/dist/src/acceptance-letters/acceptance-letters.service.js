"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
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
    getAssetsDir() {
        const candidates = [
            path.join(__dirname, '..', '..', '..', 'assets'),
            path.join(__dirname, '..', '..', 'assets'),
            path.join(process.cwd(), 'assets'),
            path.join(process.cwd(), 'backend', 'assets'),
            'D:\\NexPortal\\NexOffice\\backend\\assets',
            'D:\\NEXVIEW',
        ];
        for (const c of candidates) {
            if (fs.existsSync(c)) {
                return c;
            }
        }
        return path.join(process.cwd(), 'assets');
    }
    getLetterheadBase64() {
        const assetsDir = this.getAssetsDir();
        const candidates = [
            path.join(assetsDir, 'letterhead.jpg'),
            path.join(assetsDir, 'LH NEXVIEW CONCEPT.jpg.jpeg'),
            path.join(process.cwd(), 'assets', 'letterhead.jpg'),
            path.join(__dirname, '..', '..', '..', 'assets', 'letterhead.jpg'),
            'D:\\NexPortal\\NexOffice\\backend\\assets\\letterhead.jpg',
            'D:\\NEXVIEW\\LH NEXVIEW CONCEPT.jpg.jpeg',
        ];
        for (const file of candidates) {
            if (fs.existsSync(file)) {
                try {
                    return `data:image/jpeg;base64,${fs.readFileSync(file).toString('base64')}`;
                }
                catch (e) {
                    console.error('Error reading letterhead file:', file, e);
                }
            }
        }
        return '';
    }
    getSignatorySignature(name) {
        const assetsDir = this.getAssetsDir();
        const n = (name || '').toLowerCase();
        let file = '';
        if (n.includes('faiza') || n.includes('coo')) {
            file = fs.existsSync(path.join(assetsDir, 'coo_sign.png'))
                ? 'coo_sign.png'
                : (fs.existsSync(path.join(assetsDir, 'coo_sign.svg')) ? 'coo_sign.svg' : '');
        }
        else if (n.includes('aminu') || n.includes('md')) {
            file = fs.existsSync(path.join(assetsDir, 'md_sign.jpg'))
                ? 'md_sign.jpg'
                : (fs.existsSync(path.join(assetsDir, 'md_sign.png')) ? 'md_sign.png' : '');
        }
        else if (n.includes('isiyaku') || n.includes('cto')) {
            file = fs.existsSync(path.join(assetsDir, 'cto_sign.jpg')) ? 'cto_sign.jpg' : '';
        }
        else if (n.includes('muhammad') || n.includes('cmo')) {
            file = fs.existsSync(path.join(assetsDir, 'cmo_sign.jpg')) ? 'cmo_sign.jpg' : '';
        }
        if (!file && fs.existsSync(path.join(assetsDir, 'coo_sign.png'))) {
            file = 'coo_sign.png';
        }
        if (file) {
            const fullPath = path.join(assetsDir, file);
            const ext = path.extname(file).replace('.', '').toLowerCase();
            const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : (ext === 'svg' ? 'image/svg+xml' : 'image/png');
            return `data:${mime};base64,${fs.readFileSync(fullPath).toString('base64')}`;
        }
        return '';
    }
    async create(data, user) {
        const letter = await this.prisma.acceptanceLetter.create({
            data: {
                studentName: data.studentName,
                matricNumber: data.matricNumber,
                department: data.department,
                course: data.course || data.department,
                gender: data.gender || 'MALE',
                duration: data.duration || 'From _____________ to _____________',
                institutionName: data.institutionName || '',
                recipientAddress: data.recipientAddress,
                signatoryName: data.signatoryName || 'Faiza Saidu',
                signatoryTitle: data.signatoryTitle || 'Chief Operations Officer (COO)',
                signatureUrl: data.signatureUrl || null,
                issuedBy: user?.id,
            },
        });
        const qrCodeUrl = await this.documentsService.generateQrCode(`https://nexviewconcept.com.ng/verify-letter/${letter.id}`);
        const updated = await this.prisma.acceptanceLetter.update({
            where: { id: letter.id },
            data: { qrCodeUrl },
        });
        return updated;
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
        const letterheadBase64 = this.getLetterheadBase64();
        const isFemale = (letter.gender || '').toUpperCase() === 'FEMALE';
        const hisHer = isFemale ? 'her' : 'his';
        const heShe = isFemale ? 'she' : 'he';
        const himHer = isFemale ? 'her' : 'him';
        const formattedDate = new Date(letter.dateIssued).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const signatureSrc = letter.signatureUrl || this.getSignatorySignature(letter.signatoryName);
        const durationText = letter.duration && letter.duration.trim() ? letter.duration.trim() : 'From _____________ to _____________';
        const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @page {
          size: A4 portrait;
          margin: 0;
        }
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
          width: 210mm;
          height: 297mm;
          ${letterheadBase64 ? `background-image: url('${letterheadBase64}');` : ''}
          background-size: 210mm 297mm;
          background-repeat: no-repeat;
          font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
          color: #111;
          position: relative;
          overflow: hidden;
        }
        .content {
          padding: 38mm 20mm 28mm 20mm;
          font-size: 13.5px;
          line-height: 1.5;
          height: 297mm;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .top-body {
          flex: 1;
        }
        .date {
          text-align: right;
          font-size: 13.5px;
          margin-bottom: 20px;
          font-weight: 500;
          color: #222;
        }
        .recipient {
          font-size: 13.5px;
          line-height: 1.45;
          margin-bottom: 22px;
          white-space: pre-line;
          color: #111;
        }
        .subject {
          text-align: center;
          font-size: 14.5px;
          font-weight: 800;
          text-decoration: underline;
          text-transform: uppercase;
          margin-bottom: 20px;
          letter-spacing: 0.3px;
          color: #000;
        }
        .body-p {
          text-align: justify;
          margin-bottom: 14px;
          line-height: 1.55;
        }
        .placement-list {
          margin: 10px 0 14px 0;
          padding-left: 20px;
          list-style-type: disc;
        }
        .placement-list li {
          margin-bottom: 5px;
          line-height: 1.45;
        }
        .placement-list strong {
          font-weight: 700;
        }
        .bottom-section {
          margin-bottom: 5mm;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .signatory {
          font-size: 13.5px;
          line-height: 1.35;
        }
        .signatory .yours {
          margin-bottom: 6px;
        }
        .signatory img {
          height: 48px;
          max-width: 160px;
          display: block;
          margin-bottom: 6px;
          object-fit: contain;
        }
        .signatory .space {
          height: 48px;
        }
        .signatory .name {
          font-weight: 700;
          color: #111;
        }
        .signatory .title {
          color: #333;
        }
        .qr-block {
          text-align: center;
        }
        .qr-code {
          width: 82px;
          height: 82px;
          display: inline-block;
        }
        .qr-text {
          font-size: 8.5px;
          color: #555;
          margin-top: 3px;
          line-height: 1.25;
        }
      </style>
    </head>
    <body>
      <div class="content">
        <div class="top-body">
          <div class="date">${formattedDate}</div>

          <div class="recipient">${letter.recipientAddress}</div>

          <div class="subject">LETTER OF ACCEPTANCE FOR INDUSTRIAL TRAINING (SIWES)</div>

          <div class="body-p">
            We write to officially confirm that <strong>${letter.studentName}</strong>, a student of your institution, has been accepted to undergo ${hisHer} Students Industrial Work Experience Scheme (SIWES) at Nexview Concept Limited.
          </div>

          <div class="body-p" style="margin-bottom: 4px;">Below are ${hisHer} placement details:</div>
          <ul class="placement-list">
            <li>Student Name: <strong>${letter.studentName}</strong></li>
            <li>Department: <strong>${letter.department}</strong></li>
            <li>Matriculation Number: <strong>${letter.matricNumber}</strong></li>
            <li>Duration: ${durationText.startsWith('From') || durationText.startsWith('from') ? durationText : `From ${durationText}`}</li>
          </ul>

          <div class="body-p">
            During ${hisHer} internship, ${heShe} will be attached to our operational teams to gain practical, hands-on experience relevant to ${hisHer} field of study. We expect ${himHer} to adhere strictly to our corporate rules, professional ethics, and working hours throughout ${hisHer} stay.
          </div>

          <div class="body-p">
            Thank you for partnering with us to build the capacity of future professionals.
          </div>
        </div>

        <div class="bottom-section">
          <div class="signatory">
            <div class="yours">Yours faithfully,</div>
            ${signatureSrc ? `<img src="${signatureSrc}" alt="Signature" />` : '<div class="space"></div>'}
            <div class="name">For: ${letter.signatoryName || 'Faiza Saidu'}</div>
            <div class="title">${letter.signatoryTitle || 'Chief Operations Officer (COO)'}</div>
          </div>

          <div class="qr-block">
            ${letter.qrCodeUrl ? `<img class="qr-code" src="${letter.qrCodeUrl}" alt="Verification QR Code" />` : ''}
            <div class="qr-text">Scan to verify authenticity<br/>Ref: ${letter.id.substring(0, 8).toUpperCase()}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
        return this.documentsService.generatePdf(htmlContent, { preferCSSPageSize: true });
    }
    async sendEmail(id, email) {
        const letter = await this.findOne(id);
        const pdfBuffer = await this.generatePdf(id);
        try {
            await this.emailsService.sendEmail(email, 'IT Acceptance Letter - Nexview Concept Limited', undefined, undefined, 'info@nexviewconcept.com.ng', `Dear ${letter.studentName},\n\nPlease find attached your official IT Acceptance Letter from Nexview Concept Limited.\n\nBest regards,\nNexview Concept Limited`, pdfBuffer, `Acceptance_Letter_${letter.matricNumber.replace(/[\/\\?%*:|"<>]/g, '_')}.pdf`);
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
            await this.whatsappService.sendDocument(phone, pdfBuffer, `Acceptance_Letter_${letter.matricNumber.replace(/[\/\\?%*:|"<>]/g, '_')}.pdf`, `Hello ${letter.studentName}, here is your official IT Acceptance Letter from Nexview Concept Limited.`);
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