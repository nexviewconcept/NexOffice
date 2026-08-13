import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

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

    // Fetch recent activity (AuditLogs)
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
}
