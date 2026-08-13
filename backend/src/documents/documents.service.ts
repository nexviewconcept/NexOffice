import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as qrcode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentsService {
  private cachedLogo: string | null = null;
  private cachedBlankCert: string | null = null;
  private cachedMdSign: string | null = null;
  constructor(private prisma: PrismaService) {}

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

  async generatePdf(htmlContent: string, options: puppeteer.PDFOptions = {}): Promise<Buffer> {
    try {
      const browser = await puppeteer.launch({
        headless: true,
      });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'load' });
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        ...options,
      });
      await browser.close();
      return Buffer.from(pdfBuffer);
    } catch (error) {
      throw new InternalServerErrorException('Failed to generate PDF');
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

    if (!staff.photoUrl) {
      throw new BadRequestException('Cannot generate ID without a profile photo');
    }

    const verificationUrl = `https://nexviewconcept.com.ng/verify/staff/${staff.id}`;
    const qrCodeDataUrl = await this.generateQrCode(verificationUrl);

    const html = `
      <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f3f4f6; }
            .id-card { width: 54mm; height: 86mm; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); padding: 16px; text-align: center; border-top: 8px solid #E50914; }
            .photo { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin: 10px auto; border: 3px solid #E50914; display: block; }
            .name { font-size: 16px; font-weight: bold; margin: 8px 0 4px; color: #111827; }
            .designation { font-size: 12px; color: #4B5563; margin-bottom: 4px; }
            .qr-code { width: 80px; height: 80px; margin: 10px auto 0; display: block; }
            .company { font-size: 11px; font-weight: bold; color: #E50914; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="id-card">
            <div class="company">NEXVIEW CONCEPT LIMITED</div>
            <img class="photo" src="http://localhost:3000${staff.photoUrl}" alt="Photo" />
            <div class="name">${staff.firstName} ${staff.lastName}</div>
            <div class="designation">${staff.designation || 'Staff'}</div>
            <div class="designation">ID: ${staff.staffIdNumber || 'N/A'}</div>
            <img class="qr-code" src="${qrCodeDataUrl}" alt="QR Code" />
          </div>
        </body>
      </html>
    `;

    return this.generatePdf(html);
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
}
