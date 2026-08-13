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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const schedule_1 = require("@nestjs/schedule");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    prisma;
    logger = new common_1.Logger(NotificationsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sendEmail(to, subject, template, context) {
        this.logger.log(`Simulating sending email to ${to} with subject "${subject}"`);
        await this.prisma.emailLog.create({
            data: { recipient: to, subject, template, status: 'SENT' }
        });
    }
    async logAudit(userId, action, entity, entityId = null, ipAddress = null) {
        await this.prisma.auditLog.create({
            data: { userId, action, entity, entityId, ipAddress }
        });
    }
    async createAnnouncement(data, userId) {
        const { title, message, recurrence, channel, audience, repeatEmail, startDate, expiryDate } = data;
        return this.prisma.announcement.create({
            data: {
                title,
                message,
                recurrence,
                channel,
                audience,
                repeatEmail,
                startDate: startDate ? new Date(startDate) : new Date(),
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                createdBy: userId,
            }
        });
    }
    async getAllAnnouncements() {
        return this.prisma.announcement.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { occurrences: true } } }
        });
    }
    async updateAnnouncementStatus(id, status) {
        return this.prisma.announcement.update({
            where: { id },
            data: { status }
        });
    }
    async evaluateAnnouncements() {
        const now = new Date();
        const activeAnnouncements = await this.prisma.announcement.findMany({
            where: { status: 'ACTIVE' }
        });
        for (const ann of activeAnnouncements) {
            if (ann.expiryDate && now > ann.expiryDate) {
                await this.prisma.announcement.update({ where: { id: ann.id }, data: { status: 'EXPIRED' } });
                continue;
            }
            if (now < ann.startDate) {
                continue;
            }
            const shouldFire = await this.checkRecurrence(ann, now);
            if (shouldFire) {
                this.logger.log(`Firing occurrence for Announcement: ${ann.title}`);
                const recent = await this.prisma.announcementOccurrence.findFirst({
                    where: {
                        announcementId: ann.id,
                        firedAt: { gte: new Date(now.getTime() - 60000) }
                    }
                });
                if (!recent) {
                    await this.prisma.announcementOccurrence.create({
                        data: { announcementId: ann.id, firedAt: now }
                    });
                    if (ann.channel === 'EMAIL' || ann.channel === 'BOTH') {
                        this.logger.log(`Would queue email for audience: ${ann.audience}`);
                    }
                    if (ann.recurrence === 'ONCE') {
                        await this.prisma.announcement.update({ where: { id: ann.id }, data: { status: 'STOPPED' } });
                    }
                }
            }
        }
    }
    async checkRecurrence(ann, now) {
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        if (ann.recurrence === 'ONCE') {
            const count = await this.prisma.announcementOccurrence.count({ where: { announcementId: ann.id } });
            return count === 0;
        }
        if (ann.recurrence === 'DAILY') {
            return currentHour === 9 && currentMinute === 0;
        }
        if (ann.recurrence === 'TWICE_DAILY') {
            return (currentHour === 8 && currentMinute === 0) || (currentHour === 18 && currentMinute === 0);
        }
        if (ann.recurrence === 'WEEKLY') {
            return now.getDay() === 1 && currentHour === 9 && currentMinute === 0;
        }
        return false;
    }
    async getMyFeed(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { roles: { include: { role: true } } }
        });
        const userRoleNames = user?.roles.map(r => r.role.name) || [];
        let audiences = ['ALL', 'STAFF'];
        if (userRoleNames.includes('DIRECTOR') || userRoleNames.includes('SUPER_ADMIN'))
            audiences.push('DIRECTORS');
        if (userRoleNames.includes('OPERATOR'))
            audiences.push('OPERATORS');
        const occurrences = await this.prisma.announcementOccurrence.findMany({
            where: {
                announcement: {
                    channel: { in: ['DASHBOARD', 'BOTH'] },
                    audience: { in: audiences }
                }
            },
            include: {
                announcement: true,
                reads: { where: { userId } }
            },
            orderBy: { firedAt: 'desc' },
            take: 50
        });
        return occurrences.map(occ => ({
            id: occ.id,
            title: occ.announcement.title,
            message: occ.announcement.message,
            audience: occ.announcement.audience,
            firedAt: occ.firedAt,
            isRead: occ.reads.length > 0
        }));
    }
    async markAsRead(occurrenceId, userId) {
        const existing = await this.prisma.notificationReadStatus.findUnique({
            where: { occurrenceId_userId: { occurrenceId, userId } }
        });
        if (!existing) {
            await this.prisma.notificationReadStatus.create({
                data: { occurrenceId, userId }
            });
        }
        return { success: true };
    }
};
exports.NotificationsService = NotificationsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsService.prototype, "evaluateAnnouncements", null);
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map