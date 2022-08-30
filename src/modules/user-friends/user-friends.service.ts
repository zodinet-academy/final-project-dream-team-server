import { Injectable } from "@nestjs/common";

import { responseData } from "../../common/utils";
import { UserFriendsRepository } from "./user-friends.repository";
import {
  ERROR_INTERNAL_SERVER,
  ERROR_DATA_NOT_FOUND,
} from "../../constants/code-response.constant";
import {
  IInfoFriend,
  IInfoFriendUser,
  IUserFriendsService,
} from "./interfaces";

import { Connection } from "typeorm";
import { ResponseDto } from "../../common/response.dto";
import { CloudinaryService } from "./../cloudinary/cloudinary.service";

@Injectable()
export class UserFriendsService implements IUserFriendsService {
  constructor(
    private readonly userFriendsRepository: UserFriendsRepository,
    private readonly cloudinaryService: CloudinaryService,
    private readonly connection: Connection
  ) {}

  async getUserFriendsByUserId(
    userId: string
  ): Promise<ResponseDto<IInfoFriendUser[] | null>> {
    try {
      const userFriends = await this.userFriendsRepository.getUserFriendsByUserId(
        userId
      );

      if (userFriends.length !== 0) {
        userFriends.map(async (userFriend) => {
          userFriend.avatar = await this.cloudinaryService.getImageUrl(
            userFriend.avatar
          );
        });

        return responseData(userFriends, "List User Friends");
      }

      return responseData([], "No Found User Friends", ERROR_DATA_NOT_FOUND);
    } catch (error) {
      return responseData(null, error.message, ERROR_INTERNAL_SERVER);
    }
  }

  async getFriendByFriendIdAndFriendId(
    userId: string,
    friendId: string
  ): Promise<ResponseDto<IInfoFriend | null>> {
    try {
      const infoFriend = await this.userFriendsRepository.getFriendByFriendIdAndFriendId(
        userId,
        friendId
      );

      if (infoFriend) {
        infoFriend.avatar = await this.cloudinaryService.getImageUrl(
          infoFriend.avatar
        );

        return responseData(infoFriend, "Info Friends");
      }

      return responseData(null, "No Found Friend", ERROR_DATA_NOT_FOUND);
    } catch (error) {
      return responseData(null, error.message, ERROR_INTERNAL_SERVER);
    }
  }
  async createManyUserFriends(data) {
    try {
      const queryRunner = this.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        data.map(async (el) => {
          await queryRunner.manager.save(
            await this.userFriendsRepository.create(el)
          );
        });
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      return responseData(null, error.message, ERROR_INTERNAL_SERVER);
    }
  }

  async getAllIdFriend(userId: string): Promise<string[]> {
    try {
      const friend = await this.userFriendsRepository.find({
        where: { fromUserId: userId },
      });
      const user = await this.userFriendsRepository.find({
        where: { userId: userId },
      });
      const friendsId = friend.map((user) => {
        return user.id;
      });
      const usersId = user.map((user) => {
        return user.id;
      });
      return [...friendsId, ...usersId];
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
