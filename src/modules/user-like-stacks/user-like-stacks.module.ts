import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserLikeStacksRepository } from "./user-like-stacks.repository";
import { UserFriendsRepository } from "../user-friends/user-friends.repository";

import { ChatModule } from "../chat/chat.module";
import { SocketModule } from "./../socket/socket.module";
import { CloudinaryModule } from "./../cloudinary/cloudinary.module";
import { UserFriendsModule } from "../user-friends/user-friends.module";
import { NotificationsModule } from "./../notifications/notifications.module";

import { UserLikeStacksController } from "./user-like-stacks.controller";

import { UserLikeStacksService } from "./user-like-stacks.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLikeStacksRepository, UserFriendsRepository]),
    UserFriendsModule,
    CloudinaryModule,
    NotificationsModule,
    ChatModule,
    SocketModule,
  ],
  controllers: [UserLikeStacksController],
  providers: [UserLikeStacksService],
  exports: [UserLikeStacksService],
})
export class UserLikeStacksModule {}
