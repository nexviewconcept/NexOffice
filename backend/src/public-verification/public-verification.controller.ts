import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/v1/verify')
export class PublicVerificationController {
  constructor(private prisma: PrismaService) {}

  @Get('staff/:idNumber')
  async verifyStaff(@Param('idNumber') idNumber: string) {
    const profile = await this.prisma.staffProfile.findUnique({
      where: { staffIdNumber: idNumber },
      include: { user: { select: { status: true } } }
    });

    if (!profile) {
      throw new NotFoundException('Staff ID not found');
    }

    return {
      staffIdNumber: profile.staffIdNumber,
      firstName: profile.firstName,
      lastName: profile.lastName,
      designation: profile.designation,
      photoUrl: profile.photoUrl,
      status: profile.user.status, // ACTIVE, INACTIVE, etc.
    };
  }

  @Get('receipt/:receiptNumber')
  async verifyReceipt(@Param('receiptNumber') receiptNumber: string) {
    const receipt = await this.prisma.receipt.findFirst({
      where: { receiptNumber },
      include: {
        invoice: {
          include: { client: true }
        }
      }
    });

    if (!receipt) {
      throw new NotFoundException('Receipt not found or invalid');
    }

    return {
      receiptNumber: receipt.receiptNumber,
      amount: receipt.amount,
      paymentDate: receipt.paymentDate,
      paymentMethod: receipt.paymentMethod,
      clientName: receipt.invoice?.client?.name || 'Unknown Client',
      invoiceNumber: receipt.invoice?.invoiceNumber || 'Unknown Invoice'
    };
  }

  @Get('cert/:certNumber')
  async verifyCert(@Param('certNumber') certNumber: string) {
    const cert = await this.prisma.certificate.findFirst({
      where: { certificateNumber: certNumber },
    });

    if (!cert) {
      throw new NotFoundException('Certificate not found or invalid');
    }

    return {
      certificateNumber: cert.certificateNumber,
      recipientName: cert.recipientName,
      courseName: cert.courseName,
      issueDate: cert.issueDate,
    };
  }

  @Get('invoice/:invoiceNumber')
  async verifyInvoice(@Param('invoiceNumber') invoiceNumber: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { invoiceNumber },
      include: { client: true }
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found or invalid');
    }

    return {
      invoiceNumber: invoice.invoiceNumber,
      total: invoice.total,
      subtotal: invoice.subtotal,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      status: invoice.status,
      clientName: invoice.client.name,
    };
  }
}
