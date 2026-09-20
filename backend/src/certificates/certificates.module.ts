import { Module } from '@nestjs/common';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';
import { DocumentsModule } from '../documents/documents.module';
import { EmailsModule } from '../emails/emails.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [DocumentsModule, EmailsModule, WhatsappModule],
  controllers: [CertificatesController],
  providers: [CertificatesService]
})
export class CertificatesModule {}
