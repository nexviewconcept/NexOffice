import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailsService } from '../emails/emails.service';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService, private emailsService: EmailsService) {}

  async createTicket(userId: string, data: any) {
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

    // Notify info@nexviewconcept.com.ng
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

  async getTickets(userId?: string) {
    const where = userId ? { userId } : {};
    return this.prisma.ticket.findMany({
      where,
      include: { user: { select: { email: true } } },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async getTicketById(id: string) {
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
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async addMessage(ticketId: string, userId: string, message: string, isSuperAdmin: boolean) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id: ticketId }, include: { user: true } });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const msg = await this.prisma.ticketMessage.create({
      data: {
        ticketId,
        userId,
        message,
        isStaff: isSuperAdmin
      },
      include: { user: { select: { email: true, staffProfile: { select: { firstName: true, lastName: true } } } } }
    });

    // Notify the other party
    if (isSuperAdmin) {
      const template = `
        <h3>Reply to your ticket ${ticket.ticketNumber}</h3>
        <p><strong>Support Team:</strong> ${message}</p>
      `;
      await this.emailsService.sendEmail(ticket.user.email, `Ticket Update: ${ticket.ticketNumber}`, template);
    } else {
      const template = `
        <h3>New reply on ticket ${ticket.ticketNumber}</h3>
        <p><strong>${ticket.user.email}:</strong> ${message}</p>
      `;
      await this.emailsService.sendEmail('info@nexviewconcept.com.ng', `Ticket Update: ${ticket.ticketNumber}`, template);
    }

    // Auto-reopen if closed and user replies
    if (!isSuperAdmin && ticket.status === 'CLOSED') {
      await this.prisma.ticket.update({ where: { id: ticketId }, data: { status: 'OPEN' } });
    } else {
      await this.prisma.ticket.update({ where: { id: ticketId }, data: { updatedAt: new Date() } }); // Just bump updated_at
    }

    return msg;
  }

  async updateStatus(id: string, status: string) {
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
}
