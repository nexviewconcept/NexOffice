import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class CertificatesService {
  constructor(
    private prisma: PrismaService,
    private documents: DocumentsService
  ) {}

  async createCertificate(data: any) {
    return this.prisma.certificate.create({
      data: {
        ...data,
        certificateNumber: `NCL-CERT-${Date.now()}`
      }
    });
  }

  async listCertificates() {
    return this.prisma.certificate.findMany({
      orderBy: { issueDate: 'desc' }
    });
  }

  async generatePdf(id: string) {
    const cert = await this.prisma.certificate.findUnique({ where: { id }});
    if (!cert) throw new NotFoundException('Certificate not found');

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
              top: 250px; left: 0; right: 0;
              text-align: center;
              padding: 0 50px;
            }
            h1 { 
              font-size: 64px; 
              font-weight: 800; 
              color: #FF0000; 
              margin: 0 0 30px; 
            }
            .certify-text { 
              font-size: 28px; 
              font-weight: 400; 
              margin-bottom: 30px; 
            }
            .name-container {
              display: inline-block;
              border-bottom: 3px solid #FF0000;
              padding: 0 50px 10px;
              margin-bottom: 20px;
            }
            .name { 
              font-size: 64px; 
              font-weight: 800; 
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .reason { 
              font-size: 24px; 
              font-weight: 400; 
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
            }
            .date {
              font-size: 20px;
              font-weight: 600;
              margin-top: 15px;
            }
            .period {
              font-size: 20px;
              display: block;
              margin-top: 5px;
              color: #444;
            }
            .skills {
              font-size: 18px;
              margin-top: 10px;
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
            .qr { width: 85px; height: 85px; display: block; }
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
              support@nexviewconcept.com.ng
            </div>
          </div>
          
          <div class="content-area">
            <h1>Certificate of Completion</h1>
            <div class="certify-text">This is to proudly certify that</div>
            
            <div class="name-container">
              <div class="name">${cert.recipientName}</div>
            </div>
            
            <div class="reason">
              has successfully fulfilled the requirements of the <strong>${cert.courseName}</strong>.<br/>
              <span class="period">
                From ${cert.startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric'})}
                ${cert.endDate ? ` to ${cert.endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric'})}` : ''}
              </span>
              ${cert.skillsLearned ? `<div class="skills"><strong>Skills Acquired:</strong> ${cert.skillsLearned}</div>` : ''}
            </div>
          </div>
          
          <div class="bottom-area">
            <div class="date-block">
              <div class="date-label">Date of Issue</div>
              <div class="date-val">${cert.issueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric'})}</div>
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
}
