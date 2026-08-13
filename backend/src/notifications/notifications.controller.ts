import { Controller, Post, Body, Param, Get, Patch, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // --- ADMIN ENDPOINTS ---
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'DIRECTOR')
  @Post('announcements')
  createAnnouncement(@Body() data: any, @Request() req: any) {
    return this.notificationsService.createAnnouncement(data, req.user.id);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'DIRECTOR')
  @Get('announcements')
  getAllAnnouncements() {
    return this.notificationsService.getAllAnnouncements();
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'DIRECTOR')
  @Patch('announcements/:id/status')
  updateAnnouncementStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.notificationsService.updateAnnouncementStatus(id, status);
  }


  // --- USER FEED ENDPOINTS ---
  @Get('my-feed')
  getMyFeed(@Request() req: any) {
    return this.notificationsService.getMyFeed(req.user.id);
  }

  @Post(':occurrenceId/read')
  markAsRead(@Param('occurrenceId') occurrenceId: string, @Request() req: any) {
    return this.notificationsService.markAsRead(occurrenceId, req.user.id);
  }
}
