const { PrismaClient } = require('@prisma/client');

async function sendInvoice() {
  const prisma = new PrismaClient();
  try {
    const invoice = await prisma.invoice.findFirst({
      where: { invoiceNumber: { startsWith: 'INV-' } },
      orderBy: { createdAt: 'desc' }
    });
    
    if (invoice) {
      console.log('Found invoice:', invoice.id);
      
      const { DocumentsService } = require('./dist/documents/documents.service');
      const { EmailsService } = require('./dist/emails/emails.service');
      const { InvoicesService } = require('./dist/invoices/invoices.service');
      
      const docService = new DocumentsService(prisma);
      const emailService = new EmailsService(prisma);
      const invService = new InvoicesService(prisma, docService, emailService);
      
      await prisma.client.update({
        where: { id: invoice.clientId },
        data: { email: 'aminusaidahmad@gmail.com' }
      });
      
      await invService.sendInvoiceEmail(invoice.id);
      console.log('Invoice emailed to aminusaidahmad@gmail.com!');
      
      await prisma.client.update({
        where: { id: invoice.clientId },
        data: { email: 'itiec2026@gmail.com' }
      });
      
    } else {
      console.log('No invoice found');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

sendInvoice();
