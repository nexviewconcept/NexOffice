const { PrismaClient } = require('@prisma/client');

async function updateClient() {
  const prisma = new PrismaClient();
  const invoice = await prisma.invoice.findFirst({
    where: { invoiceNumber: { startsWith: 'INV-' } },
    orderBy: { createdAt: 'desc' }
  });
  
  if (invoice) {
    await prisma.client.update({
      where: { id: invoice.clientId },
      data: { email: 'aminusaidahmad@gmail.com' }
    });
    console.log('Client email updated to aminusaidahmad@gmail.com, client ID:', invoice.clientId, 'invoice ID:', invoice.id);
  }
  await prisma.$disconnect();
}
updateClient();
