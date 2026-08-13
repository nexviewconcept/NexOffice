import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Post()
  create(@Body() createItemDto: any) {
    return this.inventoryService.createItem(createItemDto);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Put(':id')
  update(@Param('id') id: string, @Body() updateItemDto: any) {
    return this.inventoryService.updateItem(id, updateItemDto);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Post(':id/transactions')
  transaction(@Param('id') id: string, @Body() data: any) {
    return this.inventoryService.recordTransaction(id, data);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Get(':id/transactions')
  getTransactions(@Param('id') id: string) {
    return this.inventoryService.getTransactions(id);
  }
}
