import { Module } from '@nestjs/common';
import { StaffProfilesService } from './staff-profiles.service';
import { StaffProfilesController } from './staff-profiles.controller';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [DocumentsModule],
  providers: [StaffProfilesService],
  controllers: [StaffProfilesController]
})
export class StaffProfilesModule {}
