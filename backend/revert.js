const { PrismaClient } = require('@prisma/client');
async function revert() {
  const prisma = new PrismaClient();
  await prisma.client.update({
    where: { id: '35d45de6-89f3-4edc-9950-b74d415203e7' },
    data: { email: 'itiec2026@gmail.com' }
  });
  console.log('Reverted email');
  await prisma.$disconnect();
}
revert();
