import { Controller, Get, Post, Param, UseGuards, Body } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Get('logs')
  getLogs() {
    return this.emailsService.getLogs();
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR', 'STAFF')
  @Post('send')
  sendCustomEmail(@Body() data: { recipient: string; subject: string; body?: string; senderEmail?: string; template?: string }) {
    return this.emailsService.sendEmail(data.recipient, data.subject, data.template || 'Custom Email', undefined, data.senderEmail, data.body);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Post('test')
  sendTestEmail(@Body() data: { recipient: string; subject: string; template?: string; senderEmail?: string; body?: string }) {
    return this.emailsService.sendEmail(data.recipient, data.subject, data.template || 'Test Email', undefined, data.senderEmail, data.body);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Post(':id/retry')
  retryEmail(@Param('id') id: string) {
    return this.emailsService.retryEmail(id);
  }
}
