import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException, OnModuleDestroy } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as qrcode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentsService implements OnModuleDestroy {
  private cachedLogo: string | null = null;
  private cachedBlankCert: string | null = null;
  private cachedMdSign: string | null = null;
  private cachedBrowser: puppeteer.Browser | null = null;

  constructor(private prisma: PrismaService) {}

  async onModuleDestroy() {
    if (this.cachedBrowser) {
      await this.cachedBrowser.close().catch(e => console.error(e));
      this.cachedBrowser = null;
    }
  }

  getLogoBase64(): string {
    if (this.cachedLogo) return this.cachedLogo;
    try {
      // Look for the logo in the frontend public folder
      const logoPath = path.join(process.cwd(), '..', 'frontend', 'public', 'logo.png');
      if (fs.existsSync(logoPath)) {
        const buf = fs.readFileSync(logoPath);
        this.cachedLogo = `data:image/png;base64,${buf.toString('base64')}`;
        return this.cachedLogo;
      }
    } catch (err) {
      console.error('Error reading logo:', err);
    }
    return '';
  }

  getBlankCertBase64(): string {
    if (this.cachedBlankCert) return this.cachedBlankCert;
    try {
      const p = path.join(process.cwd(), 'assets', 'blank-cert.jpg');
      if (fs.existsSync(p)) {
        const buf = fs.readFileSync(p);
        this.cachedBlankCert = `data:image/jpeg;base64,${buf.toString('base64')}`;
        return this.cachedBlankCert;
      }
    } catch (err) {
      console.error('Error reading blank cert:', err);
    }
    return '';
  }

  getMdSignBase64(): string {
    if (this.cachedMdSign) return this.cachedMdSign;
    try {
      const p = path.join(process.cwd(), 'assets', 'md_sign.png');
      if (fs.existsSync(p)) {
        const buf = fs.readFileSync(p);
        this.cachedMdSign = `data:image/png;base64,${buf.toString('base64')}`;
        return this.cachedMdSign;
      }
    } catch (err) {
      console.error('Error reading md sign:', err);
    }
    return '';
  }

  
  async getBrowser() {
    if (this.cachedBrowser && this.cachedBrowser.isConnected()) {
      return this.cachedBrowser;
    }
    
    this.cachedBrowser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || 'D:\\NexPortal\\NexOffice\\chrome\\win64-152.0.7977.75\\chrome-win64\\chrome.exe',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--disable-dev-shm-usage']
    });
    return this.cachedBrowser;
  }

  async generatePdf(htmlContent: string, options: puppeteer.PDFOptions = {}): Promise<Buffer> {
    let page;
    try {
      const browser = await this.getBrowser();
      page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        ...options,
      });
      return Buffer.from(pdfBuffer);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      if (this.cachedBrowser) {
        try { await this.cachedBrowser.close(); } catch(e){}
        this.cachedBrowser = null;
      }
      throw new InternalServerErrorException('Failed to generate PDF');
    } finally {
      if (page) await page.close().catch(e => console.error(e));
    }
  }

  async generateQrCode(text: string): Promise<string> {
    try {
      return await qrcode.toDataURL(text);
    } catch (err) {
      throw new InternalServerErrorException('Failed to generate QR Code');
    }
  }

  async generateStaffId(staffId: string): Promise<Buffer> {
    const staff = await this.prisma.staffProfile.findUnique({
      where: { id: staffId },
      include: { user: true }
    });

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    const PDFDocument = require('pdfkit');
    
    return new Promise<Buffer>(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: [250, 400], margin: 0 }); // ID card size
        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Draw header background
        doc.rect(0, 0, 250, 50).fill('#E50914');
        doc.fillColor('white').fontSize(14).font('Helvetica-Bold').text('NEXVIEW CONCEPT LIMITED', 0, 18, { align: 'center' });

        // Photo
        if (staff.photoUrl) {
           const photoPath = path.join(process.cwd(), '..', staff.photoUrl);
           if (fs.existsSync(photoPath)) {
             doc.save();
             doc.circle(125, 120, 50).clip();
             doc.image(photoPath, 75, 70, { width: 100, height: 100 });
             doc.restore();
             // Add border
             doc.circle(125, 120, 50).lineWidth(3).stroke('#E50914');
           }
        }

        doc.moveDown(5);
        // Name
        doc.fillColor('#111827').fontSize(18).font('Helvetica-Bold').text(`${staff.firstName} ${staff.lastName}`, 0, 190, { align: 'center' });
        
        // Designation
        doc.fillColor('#E50914').fontSize(12).text(staff.designation || 'Staff', 0, 215, { align: 'center' });

        // Staff ID Number
        doc.fillColor('#6B7280').fontSize(10).font('Helvetica').text(`ID: ${staff.staffIdNumber || 'N/A'}`, 0, 235, { align: 'center' });

        // QR Code
        const verificationUrl = `https://nexviewconcept.com.ng/verify/staff/${staff.id}`;
        const qrCodeDataUrl = await this.generateQrCode(verificationUrl);
        const qrBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
        doc.image(qrBuffer, 90, 300, { width: 70, height: 70 });

        // Border around card
        doc.rect(2, 2, 246, 396).lineWidth(4).stroke('#E50914');

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  async generateStudentIdCard(studentId: string): Promise<Buffer> {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const PDFDocument = require('pdfkit');
    
    return new Promise<Buffer>(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: [250, 400], margin: 0 }); // ID card size
        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Draw header background (Blue for students)
        doc.rect(0, 0, 250, 50).fill('#0B3D91'); 

        // Add Nexview text
        doc.fillColor('white')
           .fontSize(16)
           .text('NEXVIEW CONCEPT', 0, 15, { align: 'center', stroke: false });
        doc.fontSize(10)
           .text('STUDENT ID CARD', 0, 32, { align: 'center' });

        // Add photo placeholder
        doc.rect(75, 70, 100, 100).lineWidth(2).stroke('#0B3D91');
        doc.fillColor('#000').fontSize(14).text('PHOTO', 75, 110, { width: 100, align: 'center' });

        // Add details
        doc.fillColor('black').fontSize(14).font('Helvetica-Bold');
        doc.text(`${student.firstName} ${student.lastName}`, 0, 190, { align: 'center' });
        
        doc.fontSize(10).font('Helvetica');
        doc.text('ID Number:', 20, 230);
        doc.font('Helvetica-Bold').text(student.studentIdNumber || 'N/A', 90, 230);
        
        doc.font('Helvetica').text('Phone:', 20, 250);
        doc.font('Helvetica-Bold').text(student.phone || 'N/A', 90, 250);

        const QRCode = require('qrcode');
        const qrDataUrl = await QRCode.toDataURL(`https://nexviewconcept.com.ng/verify/student/${student.studentIdNumber}`);
        doc.image(qrDataUrl, 85, 290, { width: 80 });

        // Footer
        doc.rect(0, 380, 250, 20).fill('#0B3D91');
        doc.fillColor('white').fontSize(8).text('www.nexviewconcept.com.ng', 0, 385, { align: 'center' });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  async verifyStaff(staffId: string) {
    const staff = await this.prisma.staffProfile.findUnique({
      where: { id: staffId },
      include: { user: { select: { status: true } } }
    });

    if (!staff) {
      throw new NotFoundException('Invalid or missing Staff ID');
    }

    return {
      isValid: true,
      name: `${staff.firstName} ${staff.lastName}`,
      designation: staff.designation,
      photoUrl: staff.photoUrl,
      status: staff.user.status,
    };
  }

  async generateCustomLetter(recipient: string, subject: string, content: string): Promise<Buffer> {
    const lh = await this.prisma.systemSetting.findUnique({ where: { key: 'letterhead' } });
    const sig = await this.prisma.systemSetting.findUnique({ where: { key: 'signature' } });
    const letterheadUrl = lh?.value;
    const signatureUrl = sig?.value;

    

    // Save to DB to generate an ID for verification
    const documentRecord = await this.prisma.officialDocument.create({
      data: {
        recipient,
        subject,
        content
      }
    });

    // Generate QR Code
    const verificationUrl = `https://nexviewconcept.com.ng/verify-document/${documentRecord.id}`;
    const qrCodeDataUrl = await this.generateQrCode(verificationUrl);

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <style>
        @page { margin: 0; size: A4 portrait; }
        body { font-family: 'Montserrat', sans-serif; margin: 0; padding: 0; color: #111; min-height: 100vh; position: relative; box-sizing: border-box; padding-bottom: 150px; }
        .container { padding: 0 50px; position: relative; }
        
        .header-strip { display: flex; justify-content: center; align-items: flex-start; gap: 10px; padding-top: 40px; margin-bottom: 10px; }
        .logo { height: 60px; object-fit: contain; }
        .rc-text { font-size: 10px; font-weight: 600; margin-top: 5px; letter-spacing: 0.5px; }
        .red-line { height: 4px; background-color: #FF0000; width: 100%; margin-bottom: 40px; }
        
        .date { text-align: right; margin-bottom: 20px; font-weight: 600; font-size: 14px; }
        .recipient { margin-bottom: 30px; white-space: pre-line; font-weight: bold; font-size: 14px; }
        .title { text-align: center; font-size: 18px; font-weight: 800; text-decoration: underline; margin-bottom: 30px; text-transform: uppercase; }
        .content { line-height: 1.6; text-align: justify; font-size: 14px; }
        
        .bottom-blocks { margin-top: 50px; }
        .signature-block { float: left; }
        .signature { max-width: 150px; max-height: 80px; margin-bottom: 5px; }
        .signature-name { font-weight: 800; font-size: 14px; margin: 0; }
        .signature-title { font-size: 12px; margin: 0; color: #555; }
        
        .qr-block { float: right; text-align: center; }
        .qr-code { width: 90px; height: 90px; }
        .qr-text { font-size: 10px; color: #777; margin-top: 5px; font-weight: 500; }
        .clearfix { clear: both; }

        .footer { position: absolute; bottom: 0; left: 0; right: 0; padding: 0 50px; text-align: center; }
        .footer-red-line { height: 4px; background-color: #FF0000; width: 100%; margin-bottom: 5px; }
        .board-title { color: #FF0000; font-weight: 800; font-size: 11px; margin: 0; }
        .board-names { font-size: 11px; font-weight: 500; margin: 2px 0 10px; color: #111; }
        .office-info { font-size: 10px; font-weight: 500; color: #111; line-height: 1.4; padding-bottom: 20px; }
        .office-info span { color: #FF0000; font-weight: 800; }
      </style>
    </head>
    <body>
      <div class="header-strip">
        ${this.getLogoBase64() ? `<img class="logo" src="${this.getLogoBase64()}" alt="Nexview Logo" />` : `<div style="font-size:24px; font-weight:800; color:#FF0000;">NEXVIEW CONCEPT LIMITED</div>`}
        <div class="rc-text">RC: 8682929</div>
      </div>
      <div class="red-line"></div>

      <div class="container">
        <div class="date">
          Date: ${new Date().toLocaleDateString('en-GB')}
        </div>

        <div class="recipient">
          ${recipient}
        </div>

        <div class="title">
          ${subject}
        </div>

        <div class="content">
          ${content}
        </div>

        <div class="bottom-blocks">
          ${signatureUrl ? 
          `<div class="signature-block">
            <p style="margin-bottom: 10px;">Yours faithfully,</p>
            <img class="signature" src="${signatureUrl}" alt="Signature" />
            <p class="signature-name">Management</p>
            <p class="signature-title">Nexview Concept Limited</p>
          </div>` : '<div></div>'}
          
          <div class="qr-block">
            <img class="qr-code" src="${qrCodeDataUrl}" alt="Verification QR Code" />
            <p class="qr-text">Scan to verify authenticity<br/>Ref: ${documentRecord.id.substring(0, 8).toUpperCase()}</p>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>

      <div class="footer">
        <div class="footer-red-line"></div>
        <p class="board-title">BOARD OF DIRECTORS:</p>
        <p class="board-names">S.I. AMANESI (Chairman), R. YAR\'ADUA, MUSTAPHA BELLO</p>
        <p class="office-info">
          <span>HEAD OFFICE:</span> B112, 1st Floor, A.A. Zauro Plaza, Along Ahmadu Bello Way, Birnin Kebbi, Kebbi State.<br/>
          <span>BRANCH OFFICE:</span> Kano State.<br/>
          <span>TEL:</span> 08101416960, 08061217036 <span>EMAIL:</span> info@nexviewconcept.com.ng <span>WEB:</span> www.nexviewconcept.com.ng
        </p>
      </div>
    </body>
    </html>
    `;

    return this.generatePdf(htmlContent);
  }

  async verifyDocument(id: string) {
    const doc = await this.prisma.officialDocument.findUnique({
      where: { id }
    });
    if (!doc) {
      throw new NotFoundException('Document not found or invalid.');
    }
    return doc;
  }

  async compressPdf(buffer: Buffer): Promise<Buffer> {
    const { exec } = require('child_process');
    const util = require('util');
    const execAsync = util.promisify(exec);
    const os = require('os');
    const path = require('path');

    const inputPath = path.join(os.tmpdir(), `input_${Date.now()}.pdf`);
    const outputPath = path.join(os.tmpdir(), `output_${Date.now()}.pdf`);

    fs.writeFileSync(inputPath, buffer);

    try {
      // PDFSETTINGS: /screen (low quality, small size), /ebook (medium), /printer (high), /prepress (highest)
      await execAsync(`gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputPath} ${inputPath}`);
      const compressedBuffer = fs.readFileSync(outputPath);
      return compressedBuffer;
    } catch (err) {
      console.error('Ghostscript compression failed:', err);
      throw new InternalServerErrorException('Failed to compress PDF');
    } finally {
      try {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      } catch (e) {}
    }
  }
}


