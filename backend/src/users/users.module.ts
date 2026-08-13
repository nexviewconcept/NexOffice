import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EmailsModule } from '../emails/emails.module';

@Module({
  imports: [EmailsModule],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
