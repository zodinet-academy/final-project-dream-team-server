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

import { ResponseDto } from "../../common/response.dto";
import { Connection } from "typeorm";

@Injectable()
export class UserFriendsService implements IUserFriendsService {
  constructor(
    private readonly userFriendsRepository: UserFriendsRepository,
    private readonly connection: Connection
  ) {}

  async getUserFriendsByUserId(
    userId: string
  ): Promise<ResponseDto<IInfoFriendUser[] | null>> {
    try {
      const userFriends = await this.userFriendsRepository.getUserFriendsByUserId(
        userId
      );

      if (userFriends) {
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
}
