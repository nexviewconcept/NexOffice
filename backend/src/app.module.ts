import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StaffProfilesModule } from './staff-profiles/staff-profiles.module';
import { DocumentsModule } from './documents/documents.module';
import { ClientsModule } from './clients/clients.module';
import { InvoicesModule } from './invoices/invoices.module';
import { ReceiptsModule } from './receipts/receipts.module';
import { InventoryModule } from './inventory/inventory.module';
import { CertificatesModule } from './certificates/certificates.module';
import { NotificationsModule } from './notifications/notifications.module';
import { FilesModule } from './files/files.module';
import { PublicVerificationModule } from './public-verification/public-verification.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FinanceModule } from './finance/finance.module';
import { EmailsModule } from './emails/emails.module';
import { SettingsModule } from './settings/settings.module';
import { AuditModule } from './audit/audit.module';
import { BackupsModule } from './backups/backups.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PermissionsModule } from './permissions/permissions.module';
import { TicketsModule } from './tickets/tickets.module';
import { ServiceLogsModule } from './service-logs/service-logs.module';
import { StudentsModule } from './students/students.module';
import { CoursesModule } from './courses/courses.module';
import { CorporateModule } from './corporate/corporate.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    PrismaModule, AuthModule, UsersModule, StaffProfilesModule, DocumentsModule, ClientsModule, InvoicesModule, ReceiptsModule, InventoryModule, CertificatesModule, NotificationsModule, FilesModule, PublicVerificationModule, FinanceModule, EmailsModule, SettingsModule, AuditModule, BackupsModule, DashboardModule, PermissionsModule, TicketsModule, ServiceLogsModule, StudentsModule, CoursesModule, CorporateModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
