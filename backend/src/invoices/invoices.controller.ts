import { Controller, Get, Post, Put, Body, Param, Delete, Res, UseGuards, Query } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { Response } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Post()
  create(@Body() data: any) {
    return this.invoicesService.createInvoice(data);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.invoicesService.updateInvoice(id, data);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Get()
  findAll() {
    return this.invoicesService.findAll();
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Get(':id/pdf')
  async downloadPdf(@Param('id') id: string, @Res() res: Response, @Query('action') action?: string) {
    const pdfBuffer = await this.invoicesService.generateInvoicePdf(id);
    const disposition = action === 'preview' ? 'inline' : 'attachment';
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${disposition}; filename=invoice.pdf`,
    });
    res.end(pdfBuffer);
  }

  @Post(':id/send-email')
  sendEmail(@Param('id') id: string, @Body() body: any) {
    return this.invoicesService.sendInvoiceEmail(id, body?.email);
  }

  @Post(':id/send-whatsapp')
  sendWhatsapp(@Param('id') id: string, @Body() body: any) {
    return this.invoicesService.sendWhatsappInvoice(id, body?.phone);
  }

  @Roles('SUPER_ADMIN')
  @Delete(':id')
  deleteInvoice(@Param('id') id: string) {
    return this.invoicesService.deleteInvoice(id);
  }
}
