import { Controller, Post, Put, Body, Param, Get, Delete, Res, UseGuards, UseInterceptors, UploadedFile, Query, Req } from '@nestjs/common';
import { StaffProfilesService } from './staff-profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Response } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/staff-profiles')
export class StaffProfilesController {
  constructor(private readonly staffProfilesService: StaffProfilesService) {}

  @Roles('SUPER_ADMIN', 'DIRECTOR')
  @Post()
  create(@Body() data: any) {
    return this.staffProfilesService.createProfile(data);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Get()
  getAll() {
    return this.staffProfilesService.getAllProfiles();
  }

  @Get('me')
  getMyProfile(@Req() req: any) {
    return this.staffProfilesService.getProfileByUserId(req.user.id);
  }

  @Put('me')
  updateMyProfile(@Req() req: any, @Body() data: any) {
    return this.staffProfilesService.updateProfileByUserId(req.user.id, data);
  }

  @Post('me/photo')
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  uploadMyPhoto(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.staffProfilesService.updateMyPhoto(req.user.id, file.filename);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Post(':id/photo')
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  uploadPhoto(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.staffProfilesService.updatePhoto(id, file.filename);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Get(':id/id-card')
  async downloadIdCard(@Param('id') id: string, @Res() res: Response, @Query('action') action?: string) {
    const pdfBuffer = await this.staffProfilesService.generateStaffIdCard(id);
    const disposition = action === 'preview' ? 'inline' : 'attachment';
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${disposition}; filename=staff-id.pdf`,
    });
    res.end(pdfBuffer);
  }

  @Roles('SUPER_ADMIN')
  @Delete(':id')
  deleteProfile(@Param('id') id: string) {
    return this.staffProfilesService.deleteProfile(id);
  }
}
