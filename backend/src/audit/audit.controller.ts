import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Roles('SUPER_ADMIN', 'DIRECTOR')
  @Get()
  getLogs(
    @Query('action') action?: string,
    @Query('entity') entity?: string,
    @Query('userId') userId?: string
  ) {
    return this.auditService.getLogs({ action, entity, userId });
  }
}
