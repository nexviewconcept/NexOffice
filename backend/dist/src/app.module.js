"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const staff_profiles_module_1 = require("./staff-profiles/staff-profiles.module");
const documents_module_1 = require("./documents/documents.module");
const clients_module_1 = require("./clients/clients.module");
const invoices_module_1 = require("./invoices/invoices.module");
const receipts_module_1 = require("./receipts/receipts.module");
const inventory_module_1 = require("./inventory/inventory.module");
const certificates_module_1 = require("./certificates/certificates.module");
const notifications_module_1 = require("./notifications/notifications.module");
const files_module_1 = require("./files/files.module");
const public_verification_module_1 = require("./public-verification/public-verification.module");
const schedule_1 = require("@nestjs/schedule");
const finance_module_1 = require("./finance/finance.module");
const emails_module_1 = require("./emails/emails.module");
const settings_module_1 = require("./settings/settings.module");
const audit_module_1 = require("./audit/audit.module");
const backups_module_1 = require("./backups/backups.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const permissions_module_1 = require("./permissions/permissions.module");
const tickets_module_1 = require("./tickets/tickets.module");
const service_logs_module_1 = require("./service-logs/service-logs.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule, auth_module_1.AuthModule, users_module_1.UsersModule, staff_profiles_module_1.StaffProfilesModule, documents_module_1.DocumentsModule, clients_module_1.ClientsModule, invoices_module_1.InvoicesModule, receipts_module_1.ReceiptsModule, inventory_module_1.InventoryModule, certificates_module_1.CertificatesModule, notifications_module_1.NotificationsModule, files_module_1.FilesModule, public_verification_module_1.PublicVerificationModule, finance_module_1.FinanceModule, emails_module_1.EmailsModule, settings_module_1.SettingsModule, audit_module_1.AuditModule, backups_module_1.BackupsModule, dashboard_module_1.DashboardModule, permissions_module_1.PermissionsModule, tickets_module_1.TicketsModule, service_logs_module_1.ServiceLogsModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map