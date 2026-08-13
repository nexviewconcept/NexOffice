import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async createItem(data: any) {
    return this.prisma.inventoryItem.create({ 
      data: {
        ...data,
        quantity: Number(data.quantity),
        minQuantity: Number(data.minQuantity),
        purchaseCost: data.purchaseCost ? Number(data.purchaseCost) : null
      } 
    });
  }

  async findAll() {
    return this.prisma.inventoryItem.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async updateItem(id: string, data: any) {
    return this.prisma.inventoryItem.update({ 
      where: { id }, 
      data: {
        ...data,
        quantity: data.quantity !== undefined ? Number(data.quantity) : undefined,
        minQuantity: data.minQuantity !== undefined ? Number(data.minQuantity) : undefined,
        purchaseCost: data.purchaseCost !== undefined ? Number(data.purchaseCost) : undefined
      } 
    });
  }

  async recordTransaction(itemId: string, data: any) {
    const item = await this.prisma.inventoryItem.findUnique({ where: { id: itemId }});
    if (!item) throw new NotFoundException('Item not found');

    let newQuantity = item.quantity;
    const transQty = Number(data.quantity);
    
    if (data.type === 'IN') {
      newQuantity += transQty;
    } else if (data.type === 'OUT') {
      if (newQuantity < transQty) {
        throw new BadRequestException(`Insufficient stock. Current stock is ${newQuantity}. Cannot remove ${transQty}.`);
      }
      newQuantity -= transQty;
    } else if (data.type === 'ADJUSTMENT') {
       newQuantity = transQty;
    } else {
       throw new BadRequestException('Invalid transaction type');
    }

    return this.prisma.$transaction([
      this.prisma.inventoryTransaction.create({
        data: { itemId, type: data.type, quantity: transQty, notes: data.notes }
      }),
      this.prisma.inventoryItem.update({
        where: { id: itemId },
        data: { quantity: newQuantity }
      })
    ]);
  }

  async getTransactions(itemId: string) {
    return this.prisma.inventoryTransaction.findMany({
      where: { itemId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
