import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserLikeStacksRepository } from "./user-like-stacks.repository";
import { UserFriendsRepository } from "../user-friends/user-friends.repository";

import { CloudinaryModule } from "./../cloudinary/cloudinary.module";
import { UserFriendsModule } from "../user-friends/user-friends.module";

import { UserLikeStacksController } from "./user-like-stacks.controller";

import { UserLikeStacksService } from "./user-like-stacks.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLikeStacksRepository, UserFriendsRepository]),
    UserFriendsModule,
    CloudinaryModule,
  ],
  controllers: [UserLikeStacksController],
  providers: [UserLikeStacksService],
  exports: [UserLikeStacksService],
})
export class UserLikeStacksModule {}
