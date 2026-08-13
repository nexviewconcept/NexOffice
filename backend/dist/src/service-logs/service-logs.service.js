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
exports.ServiceLogsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ServiceLogsService = class ServiceLogsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        return this.prisma.serviceLog.create({
            data: {
                serviceType: data.serviceType || 'NIN',
                customerName: data.customerName,
                customerPhone: data.customerPhone || null,
                amount: Number(data.amount) || 0,
                paymentStatus: data.paymentStatus || 'COMPLETE',
                paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
                deviceUsed: data.deviceUsed || 'Desktop PC',
                notes: data.notes || null,
                performedById: userId
            },
            include: {
                performedBy: {
                    select: {
                        email: true,
                        staffProfile: { select: { firstName: true, lastName: true } }
                    }
                }
            }
        });
    }
    async findAll() {
        return this.prisma.serviceLog.findMany({
            include: {
                performedBy: {
                    select: {
                        email: true,
                        staffProfile: { select: { firstName: true, lastName: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async update(id, data) {
        const existing = await this.prisma.serviceLog.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Service log not found');
        return this.prisma.serviceLog.update({
            where: { id },
            data: {
                serviceType: data.serviceType,
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                amount: data.amount !== undefined ? Number(data.amount) : undefined,
                paymentStatus: data.paymentStatus,
                deviceUsed: data.deviceUsed,
                notes: data.notes
            },
            include: {
                performedBy: {
                    select: {
                        email: true,
                        staffProfile: { select: { firstName: true, lastName: true } }
                    }
                }
            }
        });
    }
    async delete(id) {
        return this.prisma.serviceLog.delete({ where: { id } });
    }
};
exports.ServiceLogsService = ServiceLogsService;
exports.ServiceLogsService = ServiceLogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServiceLogsService);
//# sourceMappingURL=service-logs.service.js.map