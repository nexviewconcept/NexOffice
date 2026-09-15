import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    if (!data.studentIdNumber) {
      const count = await this.prisma.studentProfile.count();
      data.studentIdNumber = 'NEX-STU-' + (1000 + count + 1);
    }
    return this.prisma.studentProfile.create({ data });
  }

  async findAll() {
    return this.prisma.studentProfile.findMany({
      orderBy: { createdAt: 'desc' },
      include: { enrollments: { include: { course: true } } }
    });
  }

  async findOne(id: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id },
      include: { enrollments: { include: { course: true } } }
    });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async update(id: string, data: any) {
    return this.prisma.studentProfile.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.studentProfile.delete({ where: { id } });
  }

  async enrollCourse(studentId: string, data: { courseId: string; status?: string }) {
    return this.prisma.enrollment.create({
      data: {
        studentId,
        courseId: data.courseId,
        status: data.status || 'ENROLLED'
      }
    });
  }

  async unenrollCourse(studentId: string, courseId: string) {
    return this.prisma.enrollment.delete({
      where: {
        studentId_courseId: { studentId, courseId }
      }
    });
  }
}
