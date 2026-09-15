import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TicketsService } from '../tickets/tickets.service';


@Injectable()
export class CorporateService {
  constructor(
    private prisma: PrismaService,
    private ticketsService: TicketsService
  ) {}

  async getCatalogue() {
    // We use SystemSetting to determine service availability
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
        enabled: setting ? setting.value === 'true' : true // Default to true if not set
      };
    });
  }

  async createOrder(data: { fullName: string; email: string; phone: string; serviceId: string; description: string; idempotencyKey: string }) {
    // 1. Check idempotency
    const existingTicket = await this.prisma.ticket.findFirst({
      where: { subject: { startsWith: `[Order-${data.idempotencyKey}]` } }
    });

    if (existingTicket) {
      return { success: true, message: 'Order already received.', ticketNumber: existingTicket.ticketNumber };
    }

    // 2. Validate service
    const catalogue = await this.getCatalogue();
    const service = catalogue.find(s => s.id === data.serviceId);
    
    if (!service) {
      throw new BadRequestException('Invalid service selected.');
    }
    if (!service.enabled) {
      throw new BadRequestException('This service is currently unavailable.');
    }

    // 3. Find or create dummy user for public tickets, or assign to a system user
    // In a real system, you might create a User with role 'CLIENT' if they don't exist.
    // For now, let's create a ticket assigned to a system 'WEB_ORDER' user or find the first SUPER_ADMIN to assign the ticket as incoming.
    // Actually, tickets belong to a user. Let's find/create a generic "Corporate Website" user account.
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

    // 4. Create the ticket using ticketsService
    const ticketData = {
      subject: `[Order-${data.idempotencyKey}] ${service.name} for ${data.fullName}`,
      category: 'GENERAL',
      priority: 'NORMAL',
      message: `New order request from the corporate website for service: ${service.name}`
    };

    const ticket = await this.ticketsService.createTicket(webUser.id, ticketData);

    // 5. Add the initial message with customer details
    await this.ticketsService.addMessage(
      ticket.id, 
      webUser.id, 
      `Customer Name: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\nService: ${service.name}\n\nDescription:\n${data.description}`,
      false
    );

    return {
      success: true,
      message: 'Order received successfully.',
      ticketNumber: ticket.ticketNumber
    };
  }

  async createInquiry(data: { fullName: string; email: string; phone: string; subject: string; message: string; idempotencyKey: string }) {
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

    await this.ticketsService.addMessage(
      ticket.id, 
      webUser.id, 
      `Contact Inquiry\nName: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\n\nMessage:\n${data.message}`,
      false
    );

    return {
      success: true,
      message: 'Message sent successfully.',
      ticketNumber: ticket.ticketNumber
    };
  }
}

