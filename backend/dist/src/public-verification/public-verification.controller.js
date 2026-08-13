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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicVerificationController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PublicVerificationController = class PublicVerificationController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async verifyStaff(idNumber) {
        const profile = await this.prisma.staffProfile.findUnique({
            where: { staffIdNumber: idNumber },
            include: { user: { select: { status: true } } }
        });
        if (!profile) {
            throw new common_1.NotFoundException('Staff ID not found');
        }
        return {
            staffIdNumber: profile.staffIdNumber,
            firstName: profile.firstName,
            lastName: profile.lastName,
            designation: profile.designation,
            photoUrl: profile.photoUrl,
            status: profile.user.status,
        };
    }
    async verifyReceipt(receiptNumber) {
        const receipt = await this.prisma.receipt.findFirst({
            where: { receiptNumber },
            include: {
                invoice: {
                    include: { client: true }
                }
            }
        });
        if (!receipt) {
            throw new common_1.NotFoundException('Receipt not found or invalid');
        }
        return {
            receiptNumber: receipt.receiptNumber,
            amount: receipt.amount,
            paymentDate: receipt.paymentDate,
            paymentMethod: receipt.paymentMethod,
            clientName: receipt.invoice?.client?.name || 'Unknown Client',
            invoiceNumber: receipt.invoice?.invoiceNumber || 'Unknown Invoice'
        };
    }
    async verifyCert(certNumber) {
        const cert = await this.prisma.certificate.findFirst({
            where: { certificateNumber: certNumber },
        });
        if (!cert) {
            throw new common_1.NotFoundException('Certificate not found or invalid');
        }
        return {
            certificateNumber: cert.certificateNumber,
            recipientName: cert.recipientName,
            courseName: cert.courseName,
            issueDate: cert.issueDate,
        };
    }
    async verifyInvoice(invoiceNumber) {
        const invoice = await this.prisma.invoice.findFirst({
            where: { invoiceNumber },
            include: { client: true }
        });
        if (!invoice) {
            throw new common_1.NotFoundException('Invoice not found or invalid');
        }
        return {
            invoiceNumber: invoice.invoiceNumber,
            total: invoice.total,
            subtotal: invoice.subtotal,
            issueDate: invoice.issueDate,
            dueDate: invoice.dueDate,
            status: invoice.status,
            clientName: invoice.client.name,
        };
    }
};
exports.PublicVerificationController = PublicVerificationController;
__decorate([
    (0, common_1.Get)('staff/:idNumber'),
    __param(0, (0, common_1.Param)('idNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicVerificationController.prototype, "verifyStaff", null);
__decorate([
    (0, common_1.Get)('receipt/:receiptNumber'),
    __param(0, (0, common_1.Param)('receiptNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicVerificationController.prototype, "verifyReceipt", null);
__decorate([
    (0, common_1.Get)('cert/:certNumber'),
    __param(0, (0, common_1.Param)('certNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicVerificationController.prototype, "verifyCert", null);
__decorate([
    (0, common_1.Get)('invoice/:invoiceNumber'),
    __param(0, (0, common_1.Param)('invoiceNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicVerificationController.prototype, "verifyInvoice", null);
exports.PublicVerificationController = PublicVerificationController = __decorate([
    (0, common_1.Controller)('api/v1/verify'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublicVerificationController);
//# sourceMappingURL=public-verification.controller.js.map