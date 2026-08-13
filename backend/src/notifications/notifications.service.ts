import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private prisma: PrismaService) {}

  async sendEmail(to: string, subject: string, template: string, context: any) {
    this.logger.log(`Simulating sending email to ${to} with subject "${subject}"`);
    await this.prisma.emailLog.create({
      data: { recipient: to, subject, template, status: 'SENT' }
    });
  }

  async logAudit(userId: string | null, action: string, entity: string, entityId: string | null = null, ipAddress: string | null = null) {
    await this.prisma.auditLog.create({
      data: { userId, action, entity, entityId, ipAddress }
    });
  }

  // --- ANNOUNCEMENT LOGIC ---

  async createAnnouncement(data: any, userId: string) {
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

  async updateAnnouncementStatus(id: string, status: string) {
    return this.prisma.announcement.update({
      where: { id },
      data: { status }
    });
  }

  // --- CRON ENGINE ---
  // Every minute, check if any announcement needs to fire
  @Cron(CronExpression.EVERY_MINUTE)
  async evaluateAnnouncements() {
    // Only log if something fires to avoid spamming the console
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
            firedAt: { gte: new Date(now.getTime() - 60000) } // within last minute
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

  private async checkRecurrence(ann: any, now: Date): Promise<boolean> {
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

  // --- USER FEED LOGIC ---
  async getMyFeed(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } }
    });
    
    const userRoleNames = user?.roles.map(r => r.role.name) || [];
    
    let audiences = ['ALL', 'STAFF'];
    if (userRoleNames.includes('DIRECTOR') || userRoleNames.includes('SUPER_ADMIN')) audiences.push('DIRECTORS');
    if (userRoleNames.includes('OPERATOR')) audiences.push('OPERATORS');
    
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

  async markAsRead(occurrenceId: string, userId: string) {
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
}
