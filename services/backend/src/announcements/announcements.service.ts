import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  async getActive() {
    return this.prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async getAll() {
    return this.prisma.announcement.findMany({
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async create(data: { title: string; content?: string; priority?: number }) {
    return this.prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content || null,
        priority: data.priority || 0,
        isActive: true,
      },
    });
  }

  async update(
    id: string,
    data: { title?: string; content?: string; isActive?: boolean; priority?: number },
  ) {
    return this.prisma.announcement.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.announcement.delete({
      where: { id },
    });
  }
}
