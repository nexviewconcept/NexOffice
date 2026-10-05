import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Response } from '@nestjs/common';
import { AcceptanceLettersService } from './acceptance-letters.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('acceptance-letters')
export class AcceptanceLettersController {
  constructor(private readonly acceptanceLettersService: AcceptanceLettersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Post()
  create(@Body() data: any, @Request() req) {
    return this.acceptanceLettersService.create(data, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Get()
  findAll() {
    return this.acceptanceLettersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.acceptanceLettersService.findOne(id);
  }

  @Get(':id/pdf')
  async getPdf(@Param('id') id: string, @Response() res) {
    const buffer = await this.acceptanceLettersService.generatePdf(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=Acceptance_Letter.pdf`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Post(':id/email')
  sendEmail(@Param('id') id: string, @Body('email') email: string) {
    return this.acceptanceLettersService.sendEmail(id, email);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Post(':id/whatsapp')
  sendWhatsapp(@Param('id') id: string, @Body('phone') phone: string) {
    return this.acceptanceLettersService.sendWhatsapp(id, phone);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.acceptanceLettersService.remove(id);
  }
}
