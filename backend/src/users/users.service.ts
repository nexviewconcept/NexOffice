import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailsService } from '../emails/emails.service';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  private readonly mainSuperAdminEmail = 'md@nexviewconcept.com.ng';

  constructor(
    private prisma: PrismaService,
    private emailsService: EmailsService
  ) {}

  async createUser(data: any) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email }});
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const plainPassword = data.password || 'NexOffice@123';
    const passwordHash = await argon2.hash(plainPassword);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        notificationEmail: data.notificationEmail || null,
        passwordHash,
        roles: {
          create: data.roles?.map((roleName: string) => ({
            role: {
              connectOrCreate: {
                where: { name: roleName },
                create: { name: roleName }
              }
            }
          }))
        }
      },
      include: { roles: { include: { role: true } } }
    });

    // Send Welcome Email
    const template = `
      <h2>Welcome to NexOffice</h2>
      <p>Your account has been created successfully.</p>
      <p><strong>Login Email:</strong> ${data.email}</p>
      <p><strong>Password:</strong> ${plainPassword}</p>
      <p>Please login and change your password as soon as possible.</p>
    `;
    
    // Send to primary company email
    await this.emailsService.sendEmail(data.email, 'Your NexOffice Account Details', template);
    
    // Send to notification email if provided
    if (data.notificationEmail) {
      await this.emailsService.sendEmail(data.notificationEmail, 'Your NexOffice Account Details', template);
    }

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, status: true, createdAt: true, roles: { include: { role: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');
    
    const valid = await argon2.verify(user.passwordHash, currentPass);
    if (!valid) throw new BadRequestException('Invalid current password');

    const passwordHash = await argon2.hash(newPass);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash }
    });

    return { message: 'Password updated successfully' };
  }

  async updateStatus(id: string, status: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (user?.email === this.mainSuperAdminEmail && status === 'INACTIVE') {
      throw new BadRequestException('Cannot deactivate the Main Super Admin');
    }
    return this.prisma.user.update({
      where: { id },
      data: { status }
    });
  }

  async updateRoles(id: string, roleNames: string[]) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (user?.email === this.mainSuperAdminEmail) {
      throw new BadRequestException('Cannot change the role of the Main Super Admin');
    }

    // Delete existing roles
    await this.prisma.userRole.deleteMany({ where: { userId: id } });
    
    // Add new roles
    return this.prisma.user.update({
      where: { id },
      data: {
        roles: {
          create: roleNames.map(roleName => ({
            role: {
              connectOrCreate: {
                where: { name: roleName },
                create: { name: roleName }
              }
            }
          }))
        }
      },
      include: { roles: { include: { role: true } } }
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (user?.email === this.mainSuperAdminEmail) {
      throw new BadRequestException('Cannot delete the Main Super Admin');
    }
    
    // Prisma will cascade delete UserRoles if configured, or we delete manually
    await this.prisma.userRole.deleteMany({ where: { userId: id } });
    return this.prisma.user.delete({ where: { id } });
  }
}
