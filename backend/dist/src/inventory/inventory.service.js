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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InventoryService = class InventoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createItem(data) {
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
    async updateItem(id, data) {
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
    async recordTransaction(itemId, data) {
        const item = await this.prisma.inventoryItem.findUnique({ where: { id: itemId } });
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        let newQuantity = item.quantity;
        const transQty = Number(data.quantity);
        if (data.type === 'IN') {
            newQuantity += transQty;
        }
        else if (data.type === 'OUT') {
            if (newQuantity < transQty) {
                throw new common_1.BadRequestException(`Insufficient stock. Current stock is ${newQuantity}. Cannot remove ${transQty}.`);
            }
            newQuantity -= transQty;
        }
        else if (data.type === 'ADJUSTMENT') {
            newQuantity = transQty;
        }
        else {
            throw new common_1.BadRequestException('Invalid transaction type');
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
    async getTransactions(itemId) {
        return this.prisma.inventoryTransaction.findMany({
            where: { itemId },
            orderBy: { createdAt: 'desc' }
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map