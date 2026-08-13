import { Controller, Post, Body, Param, Get, Res, UseGuards, Query } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Post()
  create(@Body() data: any) {
    return this.certificatesService.createCertificate(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Get()
  findAll() {
    return this.certificatesService.listCertificates();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Get(':id/pdf')
  async downloadPdf(@Param('id') id: string, @Res() res: Response, @Query('action') action?: string) {
    const pdfBuffer = await this.certificatesService.generatePdf(id);
    const disposition = action === 'preview' ? 'inline' : 'attachment';
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${disposition}; filename=certificate.pdf`,
    });
    res.end(pdfBuffer);
  }
}
