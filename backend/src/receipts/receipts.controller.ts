import { Controller, Post, Get, Body, Param, Delete, Res, UseGuards, Query } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { Response } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Post()
  create(@Body() data: any) {
    return this.receiptsService.createReceipt(data);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Get()
  findAll() {
    return this.receiptsService.findAll();
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Get(':id/pdf')
  async downloadPdf(@Param('id') id: string, @Res() res: Response, @Query('action') action?: string) {
    const pdfBuffer = await this.receiptsService.generateReceiptPdf(id);
    const disposition = action === 'preview' ? 'inline' : 'attachment';
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${disposition}; filename=receipt.pdf`,
    });
    res.end(pdfBuffer);
  }

  @Roles('SUPER_ADMIN')
  @Delete(':id')
  deleteReceipt(@Param('id') id: string) {
    return this.receiptsService.deleteReceipt(id);
  }
}
