import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceLogsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
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

  async update(id: string, data: any) {
    const existing = await this.prisma.serviceLog.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Service log not found');

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

  async delete(id: string) {
    return this.prisma.serviceLog.delete({ where: { id } });
  }
}
