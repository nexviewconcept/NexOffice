import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService, private documents: DocumentsService) {}

  async createInvoice(data: any) {
    const { clientId, items, notes, dueDate } = data;
    
    let subtotal = 0;
    if (items && items.length > 0) {
      subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);
    }
    const total = subtotal;

    return this.prisma.invoice.create({
      data: {
        subtotal,
        total,
        notes,
        dueDate: dueDate ? new Date(dueDate) : null,
        invoiceNumber: `INV-${Date.now()}`,
        status: 'SENT', 
        client: { connect: { id: clientId } },
        items: {
          create: items?.map((item: any) => ({
            description: item.description,
            quantity: Number(item.quantity),
            unit: item.unit || null,
            unitPrice: Number(item.unitPrice),
            total: Number(item.quantity) * Number(item.unitPrice)
          })) || []
        }
      },
      include: { items: true, client: true }
    });
  }

  async findAll() {
    return this.prisma.invoice.findMany({ 
      include: { client: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: { client: true, items: true, receipts: true }
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async generateInvoicePdf(id: string) {
    const invoice = await this.findOne(id);

    const verifyUrl = `https://nexviewconcept.com.ng/verify/invoice/${invoice.invoiceNumber}`;
    const qrCode = await this.documents.generateQrCode(verifyUrl);

    let itemsHtml = '';
    invoice.items.forEach(item => {
      const qtyStr = item.unit ? `${item.quantity} ${item.unit}` : item.quantity;
      itemsHtml += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.description}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${qtyStr}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₦${item.unitPrice.toLocaleString()}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₦${item.total.toLocaleString()}</td>
        </tr>
      `;
    });

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
            
            .invoice-title { font-size: 32px; font-weight: 800; margin-bottom: 20px; color: #111827; letter-spacing: 1px;}
            .meta-data { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .bill-to h4 { margin: 0 0 5px 0; color: #666; font-size: 12px; font-weight: 600; }
            .bill-to p { margin: 0; font-size: 16px; font-weight: 700; }
            .details table { width: auto; font-size: 14px;}
            .details td { padding: 3px 15px 3px 0; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px; }
            .items-table th { background: #F9FAFB; padding: 12px 10px; text-align: left; font-size: 12px; font-weight: 700; color: #6B7280; border-bottom: 1px solid #E5E7EB; }
            .items-table th.right { text-align: right; }
            .items-table th.center { text-align: center; }
            .summary { width: 300px; float: right; border-top: 2px solid #333; padding-top: 15px; }
            .summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 16px; font-weight: 500;}
            .summary-row.total { font-weight: 800; font-size: 20px; color: #FF0000; }
            .status { font-weight: 700; padding: 5px 10px; background: #eee; border-radius: 4px; display: inline-block; margin-top: 10px; font-size: 12px;}
            .qr-code { width: 80px; height: 80px; display: block; margin-top: 20px; }
            
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
            <div class="invoice-title">INVOICE</div>
            
            <div class="meta-data">
              <div class="bill-to">
                <h4>BILLED TO</h4>
                <p>${invoice.client.name}</p>
                ${invoice.client.email ? `<div style="font-size:14px;">${invoice.client.email}</div>` : ''}
                ${invoice.client.phone ? `<div style="font-size:14px;">${invoice.client.phone}</div>` : ''}
                <div class="status">STATUS: ${invoice.status.replace('_', ' ')}</div>
              </div>
              <div class="details">
                <table>
                  <tr><td style="color:#666; font-weight:600;">Invoice No:</td><td style="font-weight:700;">${invoice.invoiceNumber}</td></tr>
                  <tr><td style="color:#666; font-weight:600;">Date:</td><td style="font-weight:700;">${invoice.issueDate.toLocaleDateString()}</td></tr>
                  ${invoice.dueDate ? `<tr><td style="color:#666; font-weight:600;">Due Date:</td><td style="font-weight:700;">${invoice.dueDate.toLocaleDateString()}</td></tr>` : ''}
                </table>
              </div>
            </div>

            <table class="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th class="center">Qty</th>
                  <th class="right">Unit Price</th>
                  <th class="right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="summary">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>₦${invoice.subtotal.toLocaleString()}</span>
              </div>
              <div class="summary-row total">
                <span>Total:</span>
                <span>₦${invoice.total.toLocaleString()}</span>
              </div>
            </div>
            
            <div style="clear: both; padding-top: 30px;">
              ${invoice.notes ? `<div style="font-size:12px; font-weight:700; margin-bottom:5px;">NOTES:</div><div style="font-size:12px; color:#555;">${invoice.notes}</div>` : ''}
              <img class="qr-code" src="${qrCode}" alt="Verification QR Code" />
            </div>
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

  async deleteInvoice(id: string) {
    // Delete associated receipts first (or Prisma cascades)
    await this.prisma.receipt.deleteMany({ where: { invoiceId: id } });
    await this.prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
    return this.prisma.invoice.delete({ where: { id } });
  }
}
