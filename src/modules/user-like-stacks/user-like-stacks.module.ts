import { NotificationsModule } from "./../notifications/notifications.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { UserLikeStacksService } from "./user-like-stacks.service";
import { UserLikeStacksController } from "./user-like-stacks.controller";
import { UserLikeStacksRepository } from "./user-like-stacks.repository";
import { UserFriendsModule } from "../user-friends/user-friends.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLikeStacksRepository]),
    NotificationsModule,
    UserFriendsModule,
  ],
  controllers: [UserLikeStacksController],
  providers: [UserLikeStacksService],
  exports: [UserLikeStacksService],
})
export class UserLikeStacksModule {}
