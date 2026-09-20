import { Module } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { ReceiptsController } from './receipts.controller';
import { DocumentsModule } from '../documents/documents.module';
import { EmailsModule } from '../emails/emails.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [DocumentsModule, EmailsModule, WhatsappModule],
  controllers: [ReceiptsController],
  providers: [ReceiptsService]
})
export class ReceiptsModule {}
