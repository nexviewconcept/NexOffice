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
exports.ReceiptsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const documents_service_1 = require("../documents/documents.service");
let ReceiptsService = class ReceiptsService {
    prisma;
    documents;
    constructor(prisma, documents) {
        this.prisma = prisma;
        this.documents = documents;
    }
    async createReceipt(data) {
        const { invoiceId, amount, paymentMethod, notes } = data;
        return this.prisma.$transaction(async (tx) => {
            const invoice = await tx.invoice.findUnique({
                where: { id: invoiceId },
                include: { receipts: true }
            });
            if (!invoice)
                throw new common_1.BadRequestException('Invalid Invoice ID');
            const newReceipt = await tx.receipt.create({
                data: {
                    invoiceId,
                    amount: Number(amount),
                    paymentMethod,
                    notes,
                    receiptNumber: `REC-${Date.now()}`
                }
            });
            const previousTotalPaid = invoice.receipts.reduce((sum, r) => sum + r.amount, 0);
            const newTotalPaid = previousTotalPaid + Number(amount);
            let newStatus = 'PARTIALLY_PAID';
            if (newTotalPaid >= invoice.total - 0.01) {
                newStatus = 'PAID';
            }
            await tx.invoice.update({
                where: { id: invoice.id },
                data: { status: newStatus }
            });
            return newReceipt;
        });
    }
    async findAll() {
        return this.prisma.receipt.findMany({
            include: { invoice: { include: { client: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }
    async generateReceiptPdf(id) {
        const receipt = await this.prisma.receipt.findUnique({
            where: { id },
            include: { invoice: { include: { client: true } } }
        });
        if (!receipt)
            throw new common_1.NotFoundException('Receipt not found');
        const verifyUrl = `https://nexviewconcept.com.ng/verify/receipt/${receipt.receiptNumber}`;
        const qrCode = await this.documents.generateQrCode(verifyUrl);
        const html = `
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            @page { margin: 0; size: A4 portrait; }
            body { 
              font-family: 'Montserrat', sans-serif; 
              padding: 0; margin: 0; 
              color: #333; 
              min-height: 100vh;
              position: relative;
              box-sizing: border-box;
              padding-bottom: 150px; /* space for footer */
            }
            .header-strip {
              display: flex; justify-content: center; align-items: flex-start; gap: 10px;
              padding-top: 40px;
              margin-bottom: 10px;
            }
            .logo { height: 60px; object-fit: contain; }
            .rc-text { font-size: 10px; font-weight: 600; margin-top: 5px; letter-spacing: 0.5px; }
            .red-line { height: 4px; background-color: #FF0000; width: 100%; margin-bottom: 40px; }
            
            .content { padding: 0 50px; }
            
            .title { font-size: 32px; font-weight: 800; margin-bottom: 20px; color: #111827; letter-spacing: 1px; }
            .details-box { border: 1px solid #E5E7EB; border-radius: 8px; padding: 20px; background: #F9FAFB; margin-bottom: 30px; font-size: 14px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .label { font-size: 11px; text-transform: uppercase; color: #6B7280; margin-bottom: 5px; font-weight: 700; }
            .value { font-size: 16px; color: #111827; font-weight: 700; margin: 0; }
            .amount-box { text-align: center; padding: 30px; background: #F9FAFB; border: 2px solid #FF0000; border-radius: 8px; margin-top: 30px; }
            .amount-label { color: #FF0000; font-weight: 800; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
            .amount-value { font-size: 48px; font-weight: 800; color: #111; margin: 0; }
            .qr-code { width: 90px; height: 90px; margin-top: 30px; display: block; margin-left: auto; margin-right: auto; }
            
            .footer {
              position: absolute;
              bottom: 0; left: 0; right: 0;
              text-align: center;
            }
            .footer-red-line { height: 4px; background-color: #FF0000; width: 100%; margin-bottom: 5px; }
            .board-title { color: #FF0000; font-weight: 800; font-size: 11px; margin: 0; }
            .board-names { font-size: 11px; font-weight: 500; margin: 2px 0 10px; color: #111; }
            .office-info { font-size: 10px; font-weight: 500; color: #111; line-height: 1.4; padding-bottom: 15px; }
            .office-info span { color: #FF0000; font-weight: 800; }
          </style>
        </head>
        <body>
          <div class="header-strip">
            ${this.documents.getLogoBase64() ? `<img class="logo" src="${this.documents.getLogoBase64()}" alt="Nexview Logo" />` : `<div style="font-size:24px; font-weight:800; color:#FF0000;">NEXVIEW CONCEPT LIMITED</div>`}
            <div class="rc-text">RC: 8682929</div>
          </div>
          <div class="red-line"></div>
          
          <div class="content">
            <div class="title">OFFICIAL RECEIPT</div>
            
            <div class="details-box">
              <div class="grid">
                <div>
                  <div class="label">Receipt Number</div>
                  <p class="value">${receipt.receiptNumber}</p>
                </div>
                <div>
                  <div class="label">Payment Date</div>
                  <p class="value">${receipt.paymentDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <div class="label">Received From</div>
                  <p class="value">${receipt.invoice?.client.name || 'Unknown'}</p>
                </div>
                <div>
                  <div class="label">Payment Method</div>
                  <p class="value">${receipt.paymentMethod.replace('_', ' ')}</p>
                </div>
                <div>
                  <div class="label">For Invoice</div>
                  <p class="value">${receipt.invoice?.invoiceNumber || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div class="amount-box">
              <div class="amount-label">Amount Received</div>
              <p class="amount-value">₦${receipt.amount.toLocaleString()}</p>
            </div>
            
            ${receipt.notes ? `<div style="margin-top:30px;"><div class="label">Notes</div><p style="font-size:14px; color:#555; margin:0;">${receipt.notes}</p></div>` : ''}
            
            <img class="qr-code" src="${qrCode}" alt="Verification QR Code" />
          </div>
          
          <div class="footer">
            <div class="footer-red-line"></div>
            <p class="board-title">BOARD OF DIRECTORS:</p>
            <p class="board-names">Aminu A. Saidu (MD), Isiyaku Saidu (CTO), Faiza Saidu (COO), Muhammad Said (CMO)</p>
            <div class="office-info">
              <span>OFFICE ADDRESS:</span> No. 30, Funtua/Yashe Road, Malumfashi - Katsina State<br/>
              📞 08027683019, 07068844784 | ✉ info@nexviewconcept.com.ng
            </div>
          </div>
        </body>
      </html>
    `;
        return this.documents.generatePdf(html);
    }
    async deleteReceipt(id) {
        return this.prisma.receipt.delete({ where: { id } });
    }
};
exports.ReceiptsService = ReceiptsService;
exports.ReceiptsService = ReceiptsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, documents_service_1.DocumentsService])
], ReceiptsService);
//# sourceMappingURL=receipts.service.js.map