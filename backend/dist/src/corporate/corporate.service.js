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
exports.CorporateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const tickets_service_1 = require("../tickets/tickets.service");
let CorporateService = class CorporateService {
    prisma;
    ticketsService;
    constructor(prisma, ticketsService) {
        this.prisma = prisma;
        this.ticketsService = ticketsService;
    }
    async getCatalogue() {
        const settings = await this.prisma.systemSetting.findMany({
            where: { key: { startsWith: 'service_' } }
        });
        const defaultServices = [
            { id: 'cac', name: 'CAC Registration', description: 'Business name and company registration.' },
            { id: 'nin', name: 'NIN Registration', description: 'National Identity Number enrollment.' },
            { id: 'bvn', name: 'BVN Registration', description: 'Bank Verification Number setup.' }
        ];
        return defaultServices.map(srv => {
            const setting = settings.find(s => s.key === `service_${srv.id}_enabled`);
            return {
                ...srv,
                enabled: setting ? setting.value === 'true' : true
            };
        });
    }
    async createOrder(data) {
        const existingTicket = await this.prisma.ticket.findFirst({
            where: { subject: { startsWith: `[Order-${data.idempotencyKey}]` } }
        });
        if (existingTicket) {
            return { success: true, message: 'Order already received.', ticketNumber: existingTicket.ticketNumber };
        }
        const catalogue = await this.getCatalogue();
        const service = catalogue.find(s => s.id === data.serviceId);
        if (!service) {
            throw new common_1.BadRequestException('Invalid service selected.');
        }
        if (!service.enabled) {
            throw new common_1.BadRequestException('This service is currently unavailable.');
        }
        let webUser = await this.prisma.user.findFirst({ where: { email: 'website@nexviewconcept.com.ng' } });
        if (!webUser) {
            webUser = await this.prisma.user.create({
                data: {
                    email: 'website@nexviewconcept.com.ng',
                    passwordHash: 'NO_LOGIN_ALLOWED',
                    status: 'ACTIVE'
                }
            });
        }
        const ticketData = {
            subject: `[Order-${data.idempotencyKey}] ${service.name} for ${data.fullName}`,
            category: 'GENERAL',
            priority: 'NORMAL',
            message: `New order request from the corporate website for service: ${service.name}`
        };
        const ticket = await this.ticketsService.createTicket(webUser.id, ticketData);
        await this.ticketsService.addMessage(ticket.id, webUser.id, `Customer Name: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\nService: ${service.name}\n\nDescription:\n${data.description}`, false);
        return {
            success: true,
            message: 'Order received successfully.',
            ticketNumber: ticket.ticketNumber
        };
    }
    async createInquiry(data) {
        const existingTicket = await this.prisma.ticket.findFirst({
            where: { subject: { startsWith: `[Inquiry-${data.idempotencyKey}]` } }
        });
        if (existingTicket) {
            return { success: true, message: 'Inquiry already received.', ticketNumber: existingTicket.ticketNumber };
        }
        let webUser = await this.prisma.user.findFirst({ where: { email: 'website@nexviewconcept.com.ng' } });
        if (!webUser) {
            webUser = await this.prisma.user.create({
                data: {
                    email: 'website@nexviewconcept.com.ng',
                    passwordHash: 'NO_LOGIN_ALLOWED',
                    status: 'ACTIVE'
                }
            });
        }
        const ticketData = {
            subject: `[Inquiry-${data.idempotencyKey}] ${data.subject} - from ${data.fullName}`,
            category: 'GENERAL',
            priority: 'NORMAL',
            message: `Contact inquiry received from the corporate website from ${data.fullName} (${data.email})`
        };
        const ticket = await this.ticketsService.createTicket(webUser.id, ticketData);
        await this.ticketsService.addMessage(ticket.id, webUser.id, `Contact Inquiry\nName: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\n\nMessage:\n${data.message}`, false);
        return {
            success: true,
            message: 'Message sent successfully.',
            ticketNumber: ticket.ticketNumber
        };
    }
};
exports.CorporateService = CorporateService;
exports.CorporateService = CorporateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tickets_service_1.TicketsService])
], CorporateService);
//# sourceMappingURL=corporate.service.js.map