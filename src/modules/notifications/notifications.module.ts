import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationsController } from "./notifications.controller";
import { NotificationsRepository } from "./notifications.repository";
import { NotificationsService } from "./notifications.service";

@Module({
  imports: [TypeOrmModule.forFeature([NotificationsRepository])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
