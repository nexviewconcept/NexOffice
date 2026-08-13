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
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const finance_service_1 = require("./finance.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let FinanceController = class FinanceController {
    financeService;
    constructor(financeService) {
        this.financeService = financeService;
    }
    getReport() {
        return this.financeService.getFinancialReport();
    }
    createCategory(data) {
        return this.financeService.createExpenseCategory(data);
    }
    getCategories() {
        return this.financeService.getExpenseCategories();
    }
    createExpense(data) {
        return this.financeService.createExpense(data);
    }
    getExpenses() {
        return this.financeService.getExpenses();
    }
    deleteExpense(id) {
        return this.financeService.deleteExpense(id);
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR'),
    (0, common_1.Get)('report'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getReport", null);
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR'),
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createCategory", null);
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR'),
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getCategories", null);
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR'),
    (0, common_1.Post)('expenses'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createExpense", null);
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR'),
    (0, common_1.Get)('expenses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getExpenses", null);
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR'),
    (0, common_1.Delete)('expenses/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "deleteExpense", null);
exports.FinanceController = FinanceController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('api/v1/finance'),
    __metadata("design:paramtypes", [finance_service_1.FinanceService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map