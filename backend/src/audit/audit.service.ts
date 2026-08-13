import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  async getLogs(filters: { action?: string; entity?: string; userId?: string }) {
    const whereClause: any = {};
    if (filters.action) whereClause.action = filters.action;
    if (filters.entity) whereClause.entity = filters.entity;
    if (filters.userId) whereClause.userId = filters.userId;

    return this.prisma.auditLog.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            email: true,
            staffProfile: {
              select: { firstName: true, lastName: true }
            }
          }
        }
      },
      orderBy: { timestamp: 'desc' },
      take: 200 // Limit for performance on frontend
    });
  }

  async logAction(data: { userId?: string; action: string; entity: string; entityId?: string; ipAddress?: string }) {
    try {
      await this.prisma.auditLog.create({ data });
    } catch (err) {
      this.logger.error('Failed to create audit log', err);
    }
  }
}
