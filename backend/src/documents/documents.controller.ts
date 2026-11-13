import { Controller, Get, Post, Body, Param, Res, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'DIRECTOR', 'MANAGER')
  @Post('documents/custom-letter')
  async createCustomLetter(@Body() body: { recipient: string, subject: string, content: string }, @Res() res: Response) {
    const pdfBuffer = await this.documentsService.generateCustomLetter(body.recipient, body.subject, body.content);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=custom-letter.pdf',
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }

  @Get('public/verify/document/:id')
  async verifyDocument(@Param('id') id: string) {
    return this.documentsService.verifyDocument(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'DIRECTOR', 'ADMIN', 'MANAGER', 'HR', 'OPERATOR')
  @Post('documents/compress')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 60 * 1024 * 1024 }, // 60MB max
  }))
  async compressPdfFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('level') level: string,
    @Res() res: Response
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const compressedBuffer = await this.documentsService.compressPdf(file.buffer, level || 'recommended');
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=compressed_' + file.originalname,
      'Content-Length': compressedBuffer.length.toString(),
      'X-Original-Size': file.size.toString(),
      'X-Compressed-Size': compressedBuffer.length.toString(),
      'Access-Control-Expose-Headers': 'Content-Disposition, Content-Length, X-Original-Size, X-Compressed-Size',
    });
    res.end(compressedBuffer);
  }
}
