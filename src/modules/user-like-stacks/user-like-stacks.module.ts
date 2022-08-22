import { NotificationsModule } from "./../notifications/notifications.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { UserLikeStacksService } from "./user-like-stacks.service";
import { UserLikeStacksController } from "./user-like-stacks.controller";
import { UserLikeStacksRepository } from "./user-like-stacks.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLikeStacksRepository]),
    NotificationsModule,
  ],
  controllers: [UserLikeStacksController],
  providers: [UserLikeStacksService],
  exports: [UserLikeStacksService],
})
export class UserLikeStacksModule {}
