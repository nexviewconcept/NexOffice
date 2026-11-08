import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentsService } from '../documents/documents.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { EmailsService } from '../emails/emails.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AcceptanceLettersService {
  constructor(
    private prisma: PrismaService,
    private documentsService: DocumentsService,
    private whatsappService: WhatsappService,
    private emailsService: EmailsService,
  ) {}

  private getAssetsDir(): string {
    const candidates = [
      path.join(__dirname, '..', '..', '..', 'assets'), // compiled /app/dist/src/acceptance-letters -> /app/assets
      path.join(__dirname, '..', '..', 'assets'),       // ts-node /app/src/acceptance-letters -> /app/assets
      path.join(process.cwd(), 'assets'),               // /app/assets
      path.join(process.cwd(), 'backend', 'assets'),    // monorepo root
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

  private getLetterheadBase64(): string {
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
        } catch (e) {
          console.error('Error reading letterhead file:', file, e);
        }
      }
    }
    return '';
  }

  private getSignatorySignature(name: string): string {
    const assetsDir = this.getAssetsDir();
    const n = (name || '').toLowerCase();
    let file = '';

    if (n.includes('faiza') || n.includes('coo')) {
      file = fs.existsSync(path.join(assetsDir, 'coo_sign.png')) 
        ? 'coo_sign.png' 
        : (fs.existsSync(path.join(assetsDir, 'coo_sign.svg')) ? 'coo_sign.svg' : '');
    } else if (n.includes('aminu') || n.includes('md')) {
      file = fs.existsSync(path.join(assetsDir, 'md_sign.jpg')) 
        ? 'md_sign.jpg' 
        : (fs.existsSync(path.join(assetsDir, 'md_sign.png')) ? 'md_sign.png' : '');
    } else if (n.includes('isiyaku') || n.includes('cto')) {
      file = fs.existsSync(path.join(assetsDir, 'cto_sign.jpg')) ? 'cto_sign.jpg' : '';
    } else if (n.includes('muhammad') || n.includes('cmo')) {
      file = fs.existsSync(path.join(assetsDir, 'cmo_sign.jpg')) ? 'cmo_sign.jpg' : '';
    }

    // Fallback: if not matched, check coo_sign.png as standard COO default
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

  async create(data: any, user: any) {
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

  async findOne(id: string) {
    const letter = await this.prisma.acceptanceLetter.findUnique({
      where: { id },
    });
    if (!letter) throw new NotFoundException('Letter not found');
    return letter;
  }

  async remove(id: string) {
    return this.prisma.acceptanceLetter.delete({ where: { id } });
  }

  async generatePdf(id: string) {
    const letter = await this.findOne(id);
    const letterheadBase64 = this.getLetterheadBase64();

    // Determine pronoun based on gender
    const isFemale = (letter.gender || '').toUpperCase() === 'FEMALE';
    const hisHer = isFemale ? 'her' : 'his';
    const heShe = isFemale ? 'she' : 'he';
    const himHer = isFemale ? 'her' : 'him';

    // Format Date
    const formattedDate = new Date(letter.dateIssued).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Signature resolution
    const signatureSrc = letter.signatureUrl || this.getSignatorySignature(letter.signatoryName);

    // Duration display
    const durationText = letter.duration && letter.duration.trim() ? letter.duration.trim() : 'From _____________ to _____________';

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
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
          font-family: 'Montserrat', sans-serif;
          color: #1a1a1a;
          position: relative;
          overflow: hidden;
        }
        .content {
          padding: 38mm 20mm 26mm 20mm;
          font-size: 13px;
          line-height: 1.55;
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
          font-size: 13px;
          margin-bottom: 20px;
          font-weight: 600;
          color: #333;
        }
        .recipient {
          font-size: 13px;
          line-height: 1.45;
          margin-bottom: 22px;
          white-space: pre-line;
          color: #111;
          font-weight: 500;
        }
        .subject {
          text-align: center;
          font-size: 14px;
          font-weight: 800;
          text-decoration: underline;
          text-transform: uppercase;
          margin-bottom: 20px;
          letter-spacing: 0.5px;
          color: #0b0b0b;
        }
        .body-p {
          text-align: justify;
          margin-bottom: 14px;
          line-height: 1.6;
          font-weight: 400;
          color: #222;
        }
        .placement-list {
          margin: 10px 0 14px 0;
          padding-left: 20px;
          list-style-type: disc;
        }
        .placement-list li {
          margin-bottom: 5px;
          line-height: 1.5;
          font-size: 13px;
          color: #222;
        }
        .placement-list strong {
          font-weight: 700;
          color: #000;
        }
        .bottom-section {
          margin-bottom: 4mm;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .signatory {
          font-size: 13px;
          line-height: 1.4;
        }
        .signatory .yours {
          margin-bottom: 6px;
          font-weight: 500;
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
          color: #000;
        }
        .signatory .title {
          color: #444;
          font-weight: 500;
          font-size: 12px;
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
          margin-top: 4px;
          line-height: 1.3;
          font-weight: 500;
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

  async sendEmail(id: string, email: string) {
    const letter = await this.findOne(id);
    const pdfBuffer = await this.generatePdf(id);

    try {
      await this.emailsService.sendEmail(
        email, 
        'IT Acceptance Letter - Nexview Concept Limited', 
        undefined, 
        undefined, 
        'info@nexviewconcept.com.ng', 
        `Dear ${letter.studentName},\n\nPlease find attached your official IT Acceptance Letter from Nexview Concept Limited.\n\nBest regards,\nNexview Concept Limited`, 
        pdfBuffer, 
        `Acceptance_Letter_${letter.matricNumber.replace(/[\/\\?%*:|"<>]/g, '_')}.pdf`
      );
      return { success: true };
    } catch (err) {
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async sendWhatsapp(id: string, phone: string) {
    const letter = await this.findOne(id);
    const pdfBuffer = await this.generatePdf(id);

    try {
      await this.whatsappService.sendDocument(
        phone,
        pdfBuffer,
        `Acceptance_Letter_${letter.matricNumber.replace(/[\/\\?%*:|"<>]/g, '_')}.pdf`,
        `Hello ${letter.studentName}, here is your official IT Acceptance Letter from Nexview Concept Limited.`
      );
      return { success: true };
    } catch (err) {
      throw new InternalServerErrorException('Failed to send WhatsApp message');
    }
  }
}
