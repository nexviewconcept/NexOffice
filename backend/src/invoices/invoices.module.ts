import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { DocumentsModule } from '../documents/documents.module';
import { EmailsModule } from '../emails/emails.module';

@Module({
  imports: [DocumentsModule, EmailsModule],
  controllers: [InvoicesController],
  providers: [InvoicesService]
})
export class InvoicesModule {}
