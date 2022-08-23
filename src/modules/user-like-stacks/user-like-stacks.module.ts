import { CloudinaryModule } from "./../cloudinary/cloudinary.module";
import { NotificationsModule } from "./../notifications/notifications.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { UserLikeStacksService } from "./user-like-stacks.service";
import { UserLikeStacksController } from "./user-like-stacks.controller";
import { UserLikeStacksRepository } from "./user-like-stacks.repository";
import { UserFriendsModule } from "../user-friends/user-friends.module";
import { UserFriendsRepository } from "../user-friends/user-friends.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLikeStacksRepository, UserFriendsRepository]),
    NotificationsModule,
    UserFriendsModule,
    CloudinaryModule,
  ],
  controllers: [UserLikeStacksController],
  providers: [UserLikeStacksService],
  exports: [UserLikeStacksService],
})
export class UserLikeStacksModule {}
