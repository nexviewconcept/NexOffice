const { PrismaClient } = require('@prisma/client');
async function run() {
  const prisma = new PrismaClient();
  const invoice = await prisma.invoice.findFirst({ orderBy: { createdAt: 'desc' } });
  console.log(invoice.id);
  await prisma.$disconnect();
}
run();
