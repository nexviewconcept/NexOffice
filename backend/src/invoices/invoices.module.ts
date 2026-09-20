import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { DocumentsModule } from '../documents/documents.module';
import { EmailsModule } from '../emails/emails.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [DocumentsModule, EmailsModule, WhatsappModule],
  controllers: [InvoicesController],
  providers: [InvoicesService]
})
export class InvoicesModule {}
