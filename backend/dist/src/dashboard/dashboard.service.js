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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverviewStats() {
        const totalStaff = await this.prisma.staffProfile.count();
        const pendingInvoices = await this.prisma.invoice.count({
            where: {
                status: {
                    in: ['DRAFT', 'SENT', 'PENDING']
                }
            }
        });
        const inventoryItems = await this.prisma.inventoryItem.findMany({
            select: { quantity: true, minQuantity: true }
        });
        const lowInventory = inventoryItems.filter(item => item.quantity <= item.minQuantity).length;
        const certificatesIssued = await this.prisma.certificate.count();
        const recentActivity = await this.prisma.auditLog.findMany({
            take: 10,
            orderBy: { timestamp: 'desc' },
            include: {
                user: {
                    select: { email: true, staffProfile: { select: { firstName: true, lastName: true } } }
                }
            }
        });
        const formattedActivity = recentActivity.map(log => {
            let userName = log.user?.email || 'System';
            if (log.user?.staffProfile) {
                userName = `${log.user.staffProfile.firstName} ${log.user.staffProfile.lastName}`;
            }
            return {
                id: log.id,
                action: log.action,
                entity: log.entity,
                user: userName,
                timestamp: log.timestamp
            };
        });
        return {
            totalStaff,
            pendingInvoices,
            lowInventory,
            certificatesIssued,
            recentActivity: formattedActivity
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map