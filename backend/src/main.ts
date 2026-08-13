import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { PrismaService } from './prisma/prisma.service';
import * as argon2 from 'argon2';

async function seedSuperAdmin(app: NestExpressApplication) {
  try {
    const prisma = app.get(PrismaService);
    const adminEmail = 'admin@nexviewconcept.com.ng';
    const passwordHash = await argon2.hash('@Nx.cl17576');

    const superAdminRole = await prisma.role.upsert({
      where: { name: 'SUPER_ADMIN' },
      update: {},
      create: { name: 'SUPER_ADMIN', description: 'System Administrator' },
    });

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { passwordHash },
      create: {
        email: adminEmail,
        passwordHash,
        status: 'ACTIVE',
        roles: { create: { roleId: superAdminRole.id } },
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
    console.log('✅ Auto-seed Super Admin completed successfully');
  } catch (err) {
    console.error('Auto-seed check note:', err?.message || err);
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  
  app.enableCors();

  await seedSuperAdmin(app);

  await app.listen(process.env.PORT ?? 3000);
}
import * as fs from 'fs';
import * as path from 'path';

bootstrap().catch(err => {
  try {
    fs.writeFileSync(
      path.join(__dirname, '..', '..', 'crash.log'),
      `Crash Date: ${new Date().toISOString()}\nError: ${err?.stack || err?.message || String(err)}\n`
    );
  } catch (e) {
    // Ignore log write failure
  }
  process.exit(1);
});
