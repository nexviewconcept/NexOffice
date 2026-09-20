import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.task.findMany({
      include: {
        assignee: {
          select: { id: true, email: true, staffProfile: { select: { firstName: true, lastName: true } } }
        },
        creator: {
          select: { id: true, email: true, staffProfile: { select: { firstName: true, lastName: true } } }
        },
        comments: {
          include: {
            user: { select: { id: true, email: true, staffProfile: { select: { firstName: true, lastName: true } } } }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(data: any, creatorId: string) {
    return this.prisma.task.create({
      data: {
        ...data,
        creatorId
      }
    });
  }

  async update(id: string, data: any) {
    return this.prisma.task.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return this.prisma.task.delete({
      where: { id }
    });
  }

  async addComment(taskId: string, userId: string, content: string) {
    return this.prisma.taskComment.create({
      data: {
        taskId,
        userId,
        content
      }
    });
  }
}
