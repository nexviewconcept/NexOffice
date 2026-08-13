import { Controller, Get, Post, Delete, Param, UseGuards, Res } from '@nestjs/common';
import { BackupsService } from './backups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { Response } from 'express';
import * as fs from 'fs';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/backups')
export class BackupsController {
  constructor(private readonly backupsService: BackupsService) {}

  @Roles('SUPER_ADMIN')
  @Get()
  listBackups() {
    return this.backupsService.listBackups();
  }

  @Roles('SUPER_ADMIN')
  @Post('create')
  async createBackup() {
    return await this.backupsService.generateBackup();
  }

  @Roles('SUPER_ADMIN')
  @Post(':filename/email')
  async emailBackup(@Param('filename') filename: string) {
    return this.backupsService.sendBackupToEmail(filename);
  }

  @Roles('SUPER_ADMIN')
  @Delete(':filename')
  deleteBackup(@Param('filename') filename: string) {
    return this.backupsService.deleteBackup(filename);
  }

  @Roles('SUPER_ADMIN')
  @Get(':filename/download')
  async downloadBackup(@Param('filename') filename: string, @Res({ passthrough: true }) res: Response) {
    const { stream, filepath } = await this.backupsService.getBackupFileStream(filename);
    const stat = fs.statSync(filepath);
    
    res.set({
      'Content-Type': 'application/sql',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': stat.size,
    });
    
    return stream;
  }
}
