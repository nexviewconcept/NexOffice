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
exports.ReceiptsController = void 0;
const common_1 = require("@nestjs/common");
const receipts_service_1 = require("./receipts.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let ReceiptsController = class ReceiptsController {
    receiptsService;
    constructor(receiptsService) {
        this.receiptsService = receiptsService;
    }
    create(data) {
        return this.receiptsService.createReceipt(data);
    }
    findAll() {
        return this.receiptsService.findAll();
    }
    async downloadPdf(id, res, action) {
        const pdfBuffer = await this.receiptsService.generateReceiptPdf(id);
        const disposition = action === 'preview' ? 'inline' : 'attachment';
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `${disposition}; filename=receipt.pdf`,
        });
        res.end(pdfBuffer);
    }
    deleteReceipt(id) {
        return this.receiptsService.deleteReceipt(id);
    }
};
exports.ReceiptsController = ReceiptsController;
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReceiptsController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR'),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReceiptsController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR'),
    (0, common_1.Get)(':id/pdf'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('action')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], ReceiptsController.prototype, "downloadPdf", null);
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReceiptsController.prototype, "deleteReceipt", null);
exports.ReceiptsController = ReceiptsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('api/v1/receipts'),
    __metadata("design:paramtypes", [receipts_service_1.ReceiptsService])
], ReceiptsController);
//# sourceMappingURL=receipts.controller.js.map