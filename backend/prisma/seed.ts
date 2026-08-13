import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon2.hash('@Nx.cl17576');
  
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: { name: 'SUPER_ADMIN', description: 'System Administrator' },
  });

  const adminEmail = 'admin@nexviewconcept.com.ng';

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
    },
    create: {
      email: adminEmail,
      passwordHash,
      status: 'ACTIVE',
      roles: {
        create: {
          roleId: superAdminRole.id
        }
      },
      staffProfile: {
        create: {
          firstName: 'System',
          lastName: 'Administrator',
          department: 'Management',
          designation: 'Super Admin'
        }
      }
    },
  });

  console.log('Super Admin user created/updated successfully:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
