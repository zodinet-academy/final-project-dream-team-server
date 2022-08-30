import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { UserFriendsRepository } from "./user-friends.repository";
import { UserFriendsController } from "./user-friends.controller";
import { UserFriendsService } from "./user-friends.service";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserFriendsRepository]),
    CloudinaryModule,
    UsersModule,
  ],
  controllers: [UserFriendsController],
  providers: [UserFriendsService],
  exports: [UserFriendsService],
})
export class UserFriendsModule {}
