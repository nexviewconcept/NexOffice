const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const receipts = await prisma.receipt.findMany();
  for (const r of receipts) {
    if (r.receiptNumber && r.receiptNumber.length > 15) {
      const shortNum = 'REC-' + new Date(r.createdAt).getFullYear().toString().slice(-2) + (new Date(r.createdAt).getMonth()+1).toString().padStart(2, '0') + '-' + Math.floor(1000 + Math.random() * 9000);
      await prisma.receipt.update({
        where: { id: r.id },
        data: { receiptNumber: shortNum }
      });
      console.log(Updated \ to \);
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
