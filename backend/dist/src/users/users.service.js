"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const emails_service_1 = require("../emails/emails.service");
const argon2 = __importStar(require("argon2"));
let UsersService = class UsersService {
    prisma;
    emailsService;
    mainSuperAdminEmail = 'md@nexviewconcept.com.ng';
    constructor(prisma, emailsService) {
        this.prisma = prisma;
        this.emailsService = emailsService;
    }
    async createUser(data) {
        const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            throw new common_1.BadRequestException('Email already in use');
        }
        const plainPassword = data.password || 'NexOffice@123';
        const passwordHash = await argon2.hash(plainPassword);
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                notificationEmail: data.notificationEmail || null,
                passwordHash,
                roles: {
                    create: data.roles?.map((roleName) => ({
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
        const template = `
      <h2>Welcome to NexOffice</h2>
      <p>Your account has been created successfully.</p>
      <p><strong>Login Email:</strong> ${data.email}</p>
      <p><strong>Password:</strong> ${plainPassword}</p>
      <p>Please login and change your password as soon as possible.</p>
    `;
        await this.emailsService.sendEmail(data.email, 'Your NexOffice Account Details', template);
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
    async changePassword(userId, currentPass, newPass) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.BadRequestException('User not found');
        const valid = await argon2.verify(user.passwordHash, currentPass);
        if (!valid)
            throw new common_1.BadRequestException('Invalid current password');
        const passwordHash = await argon2.hash(newPass);
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash }
        });
        return { message: 'Password updated successfully' };
    }
    async updateStatus(id, status) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (user?.email === this.mainSuperAdminEmail && status === 'INACTIVE') {
            throw new common_1.BadRequestException('Cannot deactivate the Main Super Admin');
        }
        return this.prisma.user.update({
            where: { id },
            data: { status }
        });
    }
    async updateRoles(id, roleNames) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (user?.email === this.mainSuperAdminEmail) {
            throw new common_1.BadRequestException('Cannot change the role of the Main Super Admin');
        }
        await this.prisma.userRole.deleteMany({ where: { userId: id } });
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
    async deleteUser(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (user?.email === this.mainSuperAdminEmail) {
            throw new common_1.BadRequestException('Cannot delete the Main Super Admin');
        }
        await this.prisma.userRole.deleteMany({ where: { userId: id } });
        return this.prisma.user.delete({ where: { id } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        emails_service_1.EmailsService])
], UsersService);
//# sourceMappingURL=users.service.js.map