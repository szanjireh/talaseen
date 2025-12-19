import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get('active')
  async getActiveAnnouncements() {
    return this.announcementsService.getActive();
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  async getAllAnnouncements() {
    return this.announcementsService.getAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  async createAnnouncement(
    @Body() data: { title: string; content?: string; priority?: number },
  ) {
    return this.announcementsService.create(data);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  async updateAnnouncement(
    @Param('id') id: string,
    @Body() data: { title?: string; content?: string; isActive?: boolean; priority?: number },
  ) {
    return this.announcementsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  async deleteAnnouncement(@Param('id') id: string) {
    return this.announcementsService.delete(id);
  }
}
