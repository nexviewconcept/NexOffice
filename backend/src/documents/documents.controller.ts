import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Get('staff-profiles/:id/id-card')
  async downloadStaffId(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.documentsService.generateStaffId(id);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=staff-id.pdf',
      'Content-Length': pdfBuffer.length,
    });
    
    res.end(pdfBuffer);
  }

  @Get('public/verify/staff/:id')
  async verifyStaff(@Param('id') id: string) {
    return this.documentsService.verifyStaff(id);
  }
}
