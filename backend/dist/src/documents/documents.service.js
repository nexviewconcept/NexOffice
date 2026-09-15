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
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const puppeteer = __importStar(require("puppeteer"));
const qrcode = __importStar(require("qrcode"));
const prisma_service_1 = require("../prisma/prisma.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let DocumentsService = class DocumentsService {
    prisma;
    cachedLogo = null;
    cachedBlankCert = null;
    cachedMdSign = null;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getLogoBase64() {
        if (this.cachedLogo)
            return this.cachedLogo;
        try {
            const logoPath = path.join(process.cwd(), '..', 'frontend', 'public', 'logo.png');
            if (fs.existsSync(logoPath)) {
                const buf = fs.readFileSync(logoPath);
                this.cachedLogo = `data:image/png;base64,${buf.toString('base64')}`;
                return this.cachedLogo;
            }
        }
        catch (err) {
            console.error('Error reading logo:', err);
        }
        return '';
    }
    getBlankCertBase64() {
        if (this.cachedBlankCert)
            return this.cachedBlankCert;
        try {
            const p = path.join(process.cwd(), 'assets', 'blank-cert.jpg');
            if (fs.existsSync(p)) {
                const buf = fs.readFileSync(p);
                this.cachedBlankCert = `data:image/jpeg;base64,${buf.toString('base64')}`;
                return this.cachedBlankCert;
            }
        }
        catch (err) {
            console.error('Error reading blank cert:', err);
        }
        return '';
    }
    getMdSignBase64() {
        if (this.cachedMdSign)
            return this.cachedMdSign;
        try {
            const p = path.join(process.cwd(), 'assets', 'md_sign.png');
            if (fs.existsSync(p)) {
                const buf = fs.readFileSync(p);
                this.cachedMdSign = `data:image/png;base64,${buf.toString('base64')}`;
                return this.cachedMdSign;
            }
        }
        catch (err) {
            console.error('Error reading md sign:', err);
        }
        return '';
    }
    async generatePdf(htmlContent, options = {}) {
        let browser;
        try {
            browser = await puppeteer.launch({
                headless: true,
                executablePath: 'D:\\NexPortal\\NexOffice\\chrome\\win64-152.0.7977.75\\chrome-win64\\chrome.exe',
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
            });
            const page = await browser.newPage();
            await page.setContent(htmlContent, { waitUntil: 'domcontentloaded', timeout: 15000 });
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                ...options,
            });
            return Buffer.from(pdfBuffer);
        }
        catch (error) {
            console.error('PDF Generation Error:', error);
            throw new common_1.InternalServerErrorException('Failed to generate PDF');
        }
        finally {
            if (browser)
                await browser.close();
        }
    }
    async generateQrCode(text) {
        try {
            return await qrcode.toDataURL(text);
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('Failed to generate QR Code');
        }
    }
    async generateStaffId(staffId) {
        const staff = await this.prisma.staffProfile.findUnique({
            where: { id: staffId },
            include: { user: true }
        });
        if (!staff) {
            throw new common_1.NotFoundException('Staff not found');
        }
        const PDFDocument = require('pdfkit');
        return new Promise(async (resolve, reject) => {
            try {
                const doc = new PDFDocument({ size: [250, 400], margin: 0 });
                const buffers = [];
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => resolve(Buffer.concat(buffers)));
                doc.rect(0, 0, 250, 50).fill('#E50914');
                doc.fillColor('white').fontSize(14).font('Helvetica-Bold').text('NEXVIEW CONCEPT LIMITED', 0, 18, { align: 'center' });
                if (staff.photoUrl) {
                    const photoPath = path.join(process.cwd(), '..', staff.photoUrl);
                    if (fs.existsSync(photoPath)) {
                        doc.save();
                        doc.circle(125, 120, 50).clip();
                        doc.image(photoPath, 75, 70, { width: 100, height: 100 });
                        doc.restore();
                        doc.circle(125, 120, 50).lineWidth(3).stroke('#E50914');
                    }
                }
                doc.moveDown(5);
                doc.fillColor('#111827').fontSize(18).font('Helvetica-Bold').text(`${staff.firstName} ${staff.lastName}`, 0, 190, { align: 'center' });
                doc.fillColor('#E50914').fontSize(12).text(staff.designation || 'Staff', 0, 215, { align: 'center' });
                doc.fillColor('#6B7280').fontSize(10).font('Helvetica').text(`ID: ${staff.staffIdNumber || 'N/A'}`, 0, 235, { align: 'center' });
                const verificationUrl = `https://nexviewconcept.com.ng/verify/staff/${staff.id}`;
                const qrCodeDataUrl = await this.generateQrCode(verificationUrl);
                const qrBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
                doc.image(qrBuffer, 90, 300, { width: 70, height: 70 });
                doc.rect(2, 2, 246, 396).lineWidth(4).stroke('#E50914');
                doc.end();
            }
            catch (err) {
                reject(err);
            }
        });
    }
    async generateStudentIdCard(studentId) {
        const student = await this.prisma.studentProfile.findUnique({
            where: { id: studentId }
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const PDFDocument = require('pdfkit');
        return new Promise(async (resolve, reject) => {
            try {
                const doc = new PDFDocument({ size: [250, 400], margin: 0 });
                const buffers = [];
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => resolve(Buffer.concat(buffers)));
                doc.rect(0, 0, 250, 50).fill('#0B3D91');
                doc.fillColor('white')
                    .fontSize(16)
                    .text('NEXVIEW CONCEPT', 0, 15, { align: 'center', stroke: false });
                doc.fontSize(10)
                    .text('STUDENT ID CARD', 0, 32, { align: 'center' });
                doc.rect(75, 70, 100, 100).lineWidth(2).stroke('#0B3D91');
                doc.fillColor('#000').fontSize(14).text('PHOTO', 75, 110, { width: 100, align: 'center' });
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
                doc.rect(0, 380, 250, 20).fill('#0B3D91');
                doc.fillColor('white').fontSize(8).text('www.nexviewconcept.com.ng', 0, 385, { align: 'center' });
                doc.end();
            }
            catch (err) {
                reject(err);
            }
        });
    }
    async verifyStaff(staffId) {
        const staff = await this.prisma.staffProfile.findUnique({
            where: { id: staffId },
            include: { user: { select: { status: true } } }
        });
        if (!staff) {
            throw new common_1.NotFoundException('Invalid or missing Staff ID');
        }
        return {
            isValid: true,
            name: `${staff.firstName} ${staff.lastName}`,
            designation: staff.designation,
            photoUrl: staff.photoUrl,
            status: staff.user.status,
        };
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map