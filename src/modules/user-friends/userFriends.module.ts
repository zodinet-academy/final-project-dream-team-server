import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserFriendsRepository } from "./userFriends.repository";
import { UserFriendsController } from "./userFriends.controller";
import { UserFriendsService } from "./userFriends.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserFriendsRepository])],
  controllers: [UserFriendsController],
  providers: [UserFriendsService],
  exports: [UserFriendsService],
})
export class UserFriendsModule {}
