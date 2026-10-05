import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentsService } from '../documents/documents.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { EmailsService } from '../emails/emails.service';

@Injectable()
export class AcceptanceLettersService {
  constructor(
    private prisma: PrismaService,
    private documentsService: DocumentsService,
    private whatsappService: WhatsappService,
    private emailsService: EmailsService,
  ) {}

  async create(data: any, user: any) {
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
    const settings = await this.prisma.systemSetting.findFirst();

    if (!settings?.letterheadUrl || !settings?.signatureUrl) {
      throw new BadRequestException('System letterhead or signature not configured.');
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
          <img src="${settings.letterheadUrl}" alt="Letterhead" />
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
          <img class="signature" src="${settings.signatureUrl}" alt="Signature" />
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

    return this.documentsService.generateDocumentFromHtml(htmlContent);
  }

  async sendEmail(id: string, email: string) {
    const letter = await this.findOne(id);
    const pdfBuffer = await this.generatePdf(id);

    try {
      await this.emailsService.sendEmailWithAttachment(
        email,
        'IT Acceptance Letter - Nexview Concept',
        `Dear ${letter.studentName},\n\nPlease find attached your IT Acceptance Letter.\n\nBest regards,\nNexview Concept`,
        pdfBuffer,
        `Acceptance_Letter_${letter.matricNumber}.pdf`
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
        `Acceptance_Letter_${letter.matricNumber}.pdf`,
        `Hello ${letter.studentName}, here is your IT Acceptance Letter from Nexview Concept.`
      );
      return { success: true };
    } catch (err) {
      throw new InternalServerErrorException('Failed to send WhatsApp message');
    }
  }
}
