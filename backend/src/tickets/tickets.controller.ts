import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Req() req: any, @Body() data: any) {
    return this.ticketsService.createTicket(req.user.id, data);
  }

  @Get()
  getAll(@Req() req: any) {
    // If SUPER_ADMIN, return all. Otherwise, return only user's tickets.
    const isSuperAdmin = req.user.roles.includes('SUPER_ADMIN');
    return this.ticketsService.getTickets(isSuperAdmin ? undefined : req.user.id);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.ticketsService.getTicketById(id);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Post(':id/messages')
  reply(@Req() req: any, @Param('id') id: string, @Body('message') message: string) {
    return this.ticketsService.addMessage(id, req.user.id, message, true);
  }

  @Roles('SUPER_ADMIN')
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ticketsService.updateStatus(id, status);
  }
}
