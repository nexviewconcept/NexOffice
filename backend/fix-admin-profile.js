const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@nexviewconcept.com.ng';
  
  const user = await prisma.user.findUnique({
    where: { email: adminEmail },
    include: { staffProfile: true }
  });

  if (!user) {
    console.log('Super Admin user not found');
    return;
  }

  if (user.staffProfile) {
    await prisma.staffProfile.update({
      where: { id: user.staffProfile.id },
      data: {
        staffIdNumber: 'NCL-MD-001',
        designation: 'Managing Director / Super Admin'
      }
    });
    console.log('Updated existing Super Admin staff profile');
  } else {
    await prisma.staffProfile.create({
      data: {
        userId: user.id,
        firstName: 'MD',
        lastName: '(Super Admin)',
        department: 'Management',
        designation: 'Managing Director',
        staffIdNumber: 'NCL-MD-001'
      }
    });
    console.log('Created new Staff Profile for Super Admin');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
