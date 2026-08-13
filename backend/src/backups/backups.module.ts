import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BackupsService } from './backups.service';
import { BackupsController } from './backups.controller';
import { EmailsModule } from '../emails/emails.module';

@Module({
  imports: [ScheduleModule.forRoot(), EmailsModule],
  controllers: [BackupsController],
  providers: [BackupsService],
})
export class BackupsModule {}
