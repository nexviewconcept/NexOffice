"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PermissionsService = class PermissionsService {
    prisma;
    defaultPermissions = [
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
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        await this.seedPermissions();
    }
    async seedPermissions() {
        for (const perm of this.defaultPermissions) {
            await this.prisma.permission.upsert({
                where: { action: perm },
                update: {},
                create: { action: perm, description: `Permission to ${perm.split('.')[1]} ${perm.split('.')[0]}` }
            });
        }
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
    async updateRolePermissions(roleId, permissionIds) {
        await this.prisma.rolePermission.deleteMany({
            where: { roleId }
        });
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
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map