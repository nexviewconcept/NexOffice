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
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const emails_service_1 = require("../emails/emails.service");
let TicketsService = class TicketsService {
    prisma;
    emailsService;
    constructor(prisma, emailsService) {
        this.prisma = prisma;
        this.emailsService = emailsService;
    }
    async createTicket(userId, data) {
        const ticketNumber = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
        const ticket = await this.prisma.ticket.create({
            data: {
                userId,
                ticketNumber,
                subject: data.subject,
                priority: data.priority || 'NORMAL',
                category: data.category || 'GENERAL',
                messages: {
                    create: [{
                            userId,
                            message: data.message,
                            isStaff: false
                        }]
                }
            },
            include: { user: true }
        });
        const template = `
      <h3>New Support Ticket Opened</h3>
      <p><strong>Ticket ID:</strong> ${ticket.ticketNumber}</p>
      <p><strong>User:</strong> ${ticket.user.email}</p>
      <p><strong>Subject:</strong> ${ticket.subject}</p>
      <p><strong>Message:</strong></p>
      <blockquote>${data.message}</blockquote>
    `;
        await this.emailsService.sendEmail('info@nexviewconcept.com.ng', `New Ticket: ${ticket.ticketNumber}`, template);
        return ticket;
    }
    async getTickets(userId) {
        const where = userId ? { userId } : {};
        return this.prisma.ticket.findMany({
            where,
            include: { user: { select: { email: true } } },
            orderBy: { updatedAt: 'desc' }
        });
    }
    async getTicketById(id) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id },
            include: {
                user: { select: { email: true } },
                messages: {
                    include: { user: { select: { email: true, staffProfile: { select: { firstName: true, lastName: true } } } } },
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
        if (!ticket)
            throw new common_1.NotFoundException('Ticket not found');
        return ticket;
    }
    async addMessage(ticketId, userId, message, isSuperAdmin) {
        const ticket = await this.prisma.ticket.findUnique({ where: { id: ticketId }, include: { user: true } });
        if (!ticket)
            throw new common_1.NotFoundException('Ticket not found');
        const msg = await this.prisma.ticketMessage.create({
            data: {
                ticketId,
                userId,
                message,
                isStaff: isSuperAdmin
            },
            include: { user: { select: { email: true, staffProfile: { select: { firstName: true, lastName: true } } } } }
        });
        if (isSuperAdmin) {
            const template = `
        <h3>Reply to your ticket ${ticket.ticketNumber}</h3>
        <p><strong>Support Team:</strong> ${message}</p>
      `;
            await this.emailsService.sendEmail(ticket.user.email, `Ticket Update: ${ticket.ticketNumber}`, template);
        }
        else {
            const template = `
        <h3>New reply on ticket ${ticket.ticketNumber}</h3>
        <p><strong>${ticket.user.email}:</strong> ${message}</p>
      `;
            await this.emailsService.sendEmail('info@nexviewconcept.com.ng', `Ticket Update: ${ticket.ticketNumber}`, template);
        }
        if (!isSuperAdmin && ticket.status === 'CLOSED') {
            await this.prisma.ticket.update({ where: { id: ticketId }, data: { status: 'OPEN' } });
        }
        else {
            await this.prisma.ticket.update({ where: { id: ticketId }, data: { updatedAt: new Date() } });
        }
        return msg;
    }
    async updateStatus(id, status) {
        const ticket = await this.prisma.ticket.update({
            where: { id },
            data: { status },
            include: { user: true }
        });
        if (status === 'CLOSED') {
            const template = `
        <h3>Your ticket ${ticket.ticketNumber} has been closed.</h3>
        <p>If you have any further questions, please open a new ticket or reply to reopen.</p>
      `;
            await this.emailsService.sendEmail(ticket.user.email, `Ticket Closed: ${ticket.ticketNumber}`, template);
        }
        return ticket;
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, emails_service_1.EmailsService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map