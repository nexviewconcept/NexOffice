import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ServiceLogsService } from './service-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/service-logs')
export class ServiceLogsController {
  constructor(private readonly serviceLogsService: ServiceLogsService) {}

  @Post()
  create(@Request() req: any, @Body() data: any) {
    return this.serviceLogsService.create(req.user.userId, data);
  }

  @Get()
  findAll() {
    return this.serviceLogsService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.serviceLogsService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.serviceLogsService.delete(id);
  }
}
