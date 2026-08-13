import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsService implements OnModuleInit {
  private defaultPermissions = [
    'users.view', 'users.manage',
    'staff.view', 'staff.manage',
    'clients.view', 'clients.manage',
    'invoices.view', 'invoices.manage',
    'receipts.view', 'receipts.manage',
    'inventory.view', 'inventory.manage',
    'finance.view', 'finance.manage',
    'certificates.view', 'certificates.manage',
    'settings.view', 'settings.manage'
  ];

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedPermissions();
  }

  private async seedPermissions() {
    for (const perm of this.defaultPermissions) {
      await this.prisma.permission.upsert({
        where: { action: perm },
        update: {},
        create: { action: perm, description: `Permission to ${perm.split('.')[1]} ${perm.split('.')[0]}` }
      });
    }

    // Ensure SUPER_ADMIN has all permissions
    const superAdminRole = await this.prisma.role.upsert({
      where: { name: 'SUPER_ADMIN' },
      update: {},
      create: { name: 'SUPER_ADMIN', description: 'Full system access' }
    });

    const allPerms = await this.prisma.permission.findMany();
    for (const p of allPerms) {
      await this.prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: p.id } },
        update: {},
        create: { roleId: superAdminRole.id, permissionId: p.id }
      });
    }
  }

  async getAllRolesAndPermissions() {
    const roles = await this.prisma.role.findMany({
      include: {
        permissions: {
          include: { permission: true }
        }
      }
    });

    const allPermissions = await this.prisma.permission.findMany();

    return { roles, permissions: allPermissions };
  }

  async updateRolePermissions(roleId: string, permissionIds: string[]) {
    // Delete existing permissions for the role
    await this.prisma.rolePermission.deleteMany({
      where: { roleId }
    });

    // Add new permissions
    for (const permId of permissionIds) {
      await this.prisma.rolePermission.create({
        data: {
          roleId,
          permissionId: permId
        }
      });
    }

    return { success: true };
  }
}
