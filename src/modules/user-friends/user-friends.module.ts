import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserFriendsRepository } from "./user-friends.repository";
import { UserFriendsController } from "./user-friends.controller";
import { UserFriendsService } from "./user-friends.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserFriendsRepository])],
  controllers: [UserFriendsController],
  providers: [UserFriendsService, UserFriendsRepository],
  exports: [UserFriendsService, UserFriendsRepository],
})
export class UserFriendsModule {}
