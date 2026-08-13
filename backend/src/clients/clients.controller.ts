import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Post()
  create(@Body() createClientDto: any) {
    return this.clientsService.createClient(createClientDto);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR')
  @Put(':id')
  update(@Param('id') id: string, @Body() updateClientDto: any) {
    return this.clientsService.updateClient(id, updateClientDto);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.deleteClient(id);
  }
}
