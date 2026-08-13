import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { EmailsModule } from '../emails/emails.module';

@Module({
  imports: [EmailsModule],
  providers: [TicketsService],
  controllers: [TicketsController]
})
export class TicketsModule {}
