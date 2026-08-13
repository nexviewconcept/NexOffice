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
exports.EmailsController = void 0;
const common_1 = require("@nestjs/common");
const emails_service_1 = require("./emails.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let EmailsController = class EmailsController {
    emailsService;
    constructor(emailsService) {
        this.emailsService = emailsService;
    }
    getLogs() {
        return this.emailsService.getLogs();
    }
    sendCustomEmail(data) {
        return this.emailsService.sendEmail(data.recipient, data.subject, data.template || 'Custom Email', undefined, data.senderEmail, data.body);
    }
    sendTestEmail(data) {
        return this.emailsService.sendEmail(data.recipient, data.subject, data.template || 'Test Email', undefined, data.senderEmail, data.body);
    }
    retryEmail(id) {
        return this.emailsService.retryEmail(id);
    }
};
exports.EmailsController = EmailsController;
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR'),
    (0, common_1.Get)('logs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmailsController.prototype, "getLogs", null);
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR', 'STAFF'),
    (0, common_1.Post)('send'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmailsController.prototype, "sendCustomEmail", null);
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR'),
    (0, common_1.Post)('test'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmailsController.prototype, "sendTestEmail", null);
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR'),
    (0, common_1.Post)(':id/retry'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmailsController.prototype, "retryEmail", null);
exports.EmailsController = EmailsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('api/v1/emails'),
    __metadata("design:paramtypes", [emails_service_1.EmailsService])
], EmailsController);
//# sourceMappingURL=emails.controller.js.map