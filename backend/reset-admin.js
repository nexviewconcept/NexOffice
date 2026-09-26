const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function main() {
  const email = 'md@nexviewconcept.com.ng';
  const password = '@Aminu17576';
  const passwordHash = await argon2.hash(password);

  // Find super admin role
  const role = await prisma.role.findFirst({ where: { name: 'SUPER_ADMIN' }});
  
  if (!role) {
    console.log("SUPER_ADMIN role not found!");
    return;
  }

  // Delete all users to be absolutely sure we don't have conflicts
  await prisma.userRole.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.staffProfile.deleteMany({});

  // Create the new user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      status: 'ACTIVE',
      roles: {
        create: {
          roleId: role.id
        }
      },
      staffProfile: {
        create: {
          firstName: 'MD',
          lastName: 'Nexview',
          department: 'Management',
          designation: 'Managing Director'
        }
      }
    }
  });

  console.log("Created user:", user.email);
  
  // Test compare
  const isMatch = await argon2.verify(user.passwordHash, password);
  console.log("Does it match?", isMatch);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
