import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { GetUser } from "../auth/decorator";
import { JwtAuthGuard } from "../auth/guards";
import { BlockedGuard } from "../auth/guards/blocked.guard";
import { CreateNotificationDto } from "./dto";

import { NotificationsService } from "./notifications.service";

@Controller("secure/notifications")
@UseGuards(JwtAuthGuard, BlockedGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotificationByUserId(@GetUser("id") userId: string) {
    return await this.notificationsService.getNotificationByUserId(userId);
  }

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }
}
