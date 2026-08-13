import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async createClient(data: any) {
    return this.prisma.client.create({ data });
  }

  async findAll() {
    return this.prisma.client.findMany();
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({ where: { id }, include: { invoices: true } });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async updateClient(id: string, data: any) {
    return this.prisma.client.update({ where: { id }, data });
  }

  async deleteClient(id: string) {
    return this.prisma.client.delete({ where: { id } });
  }
}
