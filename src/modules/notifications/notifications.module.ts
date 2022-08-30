import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { NotificationsService } from "./notifications.service";
import { NotificationsRepository } from "./notifications.repository";
import { NotificationsController } from "./notifications.controller";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([NotificationsRepository]), UsersModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
