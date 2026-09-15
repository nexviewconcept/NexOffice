import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.course.create({ data });
  }

  async findAll() {
    return this.prisma.course.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { enrollments: { include: { student: true } } }
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async update(id: string, data: any) {
    return this.prisma.course.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.course.delete({ where: { id } });
  }
}
