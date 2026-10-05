import { Module } from '@nestjs/common';
import { AcceptanceLettersService } from './acceptance-letters.service';
import { AcceptanceLettersController } from './acceptance-letters.controller';
import { DocumentsModule } from '../documents/documents.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { EmailsModule } from '../emails/emails.module';

@Module({
  imports: [DocumentsModule, WhatsappModule, EmailsModule],
  controllers: [AcceptanceLettersController],
  providers: [AcceptanceLettersService],
  exports: [AcceptanceLettersService],
})
export class AcceptanceLettersModule {}
