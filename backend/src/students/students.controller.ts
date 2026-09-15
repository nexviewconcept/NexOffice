import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Res } from '@nestjs/common';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DocumentsService } from '../documents/documents.service';
import type { Response } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly documentsService: DocumentsService
  ) {}

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'HR')
  @Post()
  create(@Body() createStudentDto: any) {
    return this.studentsService.create(createStudentDto);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'HR', 'OPERATOR')
  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'HR', 'OPERATOR')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'HR')
  @Put(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: any) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'HR')
  @Post(':id/enroll')
  enrollCourse(@Param('id') id: string, @Body() body: any) {
    return this.studentsService.enrollCourse(id, body);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'HR')
  @Delete(':id/enroll/:courseId')
  unenrollCourse(@Param('id') id: string, @Param('courseId') courseId: string) {
    return this.studentsService.unenrollCourse(id, courseId);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'HR', 'OPERATOR')
  @Get(':id/pdf')
  async getPdf(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.documentsService.generateStudentIdCard(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="student-${id}.pdf"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
