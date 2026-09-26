const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const client = await prisma.client.create({
    data: {
      name: 'KADEDA (ITIEC26)',
      email: 'itiec2026@gmail.com',
      phone: '+234 8035880730',
      address: '2nd Floor Mohammed Namadi Sambo Complex (Former Investment House), 27 Ali Akilu Road Unguwan Sarki Kaduna City Centre, Kaduna - Nigeria',
      type: 'COMPANY'
    }
  });

  const invoice = await prisma.invoice.create({
    data: {
      clientId: client.id,
      invoiceNumber: 'INV-' + Date.now(),
      status: 'SENT',
      subtotal: 540000,
      total: 540000,
      notes: 'PROPOSAL FOR DEVELOPMENT OF iTIEC WEBSITE. Thank you for your business.',
      items: {
        create: [
          { description: 'Domain (.com) - International Domain with Privacy Protection (1 Year)', quantity: 1, unitPrice: 30000, total: 30000 },
          { description: 'Web Hosting - SSD Storage, Unltd Bandwidth for Data Transfer (1 Year)', quantity: 1, unitPrice: 110000, total: 110000 },
          { description: 'Platform Production - AI-Accelerated Full-Stack Development (Lifetime)', quantity: 1, unitPrice: 200000, total: 200000 },
          { description: 'Support & Maintenance - Bug fixes and backup management (1 Year)', quantity: 1, unitPrice: 50000, total: 50000 },
          { description: 'Social Media Marketing - Targeted Ads, Page Management & Campaign (1 Month)', quantity: 1, unitPrice: 150000, total: 150000 }
        ]
      }
    }
  });

  console.log('Invoice created successfully: ', invoice.invoiceNumber);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
