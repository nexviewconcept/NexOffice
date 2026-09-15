import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'HR')
  @Post()
  create(@Body() createCourseDto: any) {
    return this.coursesService.create(createCourseDto);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'HR', 'OPERATOR')
  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'HR', 'OPERATOR')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'HR')
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: any) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
