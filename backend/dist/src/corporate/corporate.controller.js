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
exports.CorporateController = void 0;
const common_1 = require("@nestjs/common");
const corporate_service_1 = require("./corporate.service");
let CorporateController = class CorporateController {
    corporateService;
    constructor(corporateService) {
        this.corporateService = corporateService;
    }
    getServices() {
        return this.corporateService.getCatalogue();
    }
    createOrder(body) {
        if (!body.idempotencyKey) {
            body.idempotencyKey = Date.now().toString();
        }
        return this.corporateService.createOrder(body);
    }
    createInquiry(body) {
        if (!body.idempotencyKey) {
            body.idempotencyKey = Date.now().toString();
        }
        return this.corporateService.createInquiry(body);
    }
};
exports.CorporateController = CorporateController;
__decorate([
    (0, common_1.Get)('services'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CorporateController.prototype, "getServices", null);
__decorate([
    (0, common_1.Post)('order'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CorporateController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Post)('contact'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CorporateController.prototype, "createInquiry", null);
exports.CorporateController = CorporateController = __decorate([
    (0, common_1.Controller)('api/v1/corporate'),
    __metadata("design:paramtypes", [corporate_service_1.CorporateService])
], CorporateController);
//# sourceMappingURL=corporate.controller.js.map