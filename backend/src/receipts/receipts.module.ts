import { Module } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { ReceiptsController } from './receipts.controller';
import { DocumentsModule } from '../documents/documents.module';
import { EmailsModule } from '../emails/emails.module';

@Module({
  imports: [DocumentsModule, EmailsModule],
  controllers: [ReceiptsController],
  providers: [ReceiptsService]
})
export class ReceiptsModule {}
