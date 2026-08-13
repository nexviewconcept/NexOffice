import { Controller, Get, Post, Delete, Param, Query, UseGuards, UseInterceptors, UploadedFile, Body, Res, Req } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { Response } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Get()
  listFiles(@Req() req: any, @Query('folder') folder?: string) {
    const isSuperAdmin = req.user?.roles?.includes('SUPER_ADMIN');
    return this.filesService.listFiles(folder, req.user?.id, req.user?.email, isSuperAdmin);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string,
    @Body('description') description?: string,
    @Body('sharedWith') sharedWith?: string,
    @Body('compress') compress?: string
  ) {
    return this.filesService.uploadFile(file, folder, description, req.user?.id, sharedWith, compress);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Get(':id/download')
  async downloadFile(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const { stream, mimeType, originalName } = await this.filesService.getFileStream(id);
    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${originalName}"`,
    });
    return stream;
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR')
  @Delete(':id')
  deleteFile(@Param('id') id: string) {
    return this.filesService.deleteFile(id);
  }
}
