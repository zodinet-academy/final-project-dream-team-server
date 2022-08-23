import { UserLikeStackEntity } from "./entities/user-like-stack.entity";
import { Injectable } from "@nestjs/common";
import { Connection, Transaction } from "typeorm";
import { responseData } from "../../common/utils";
import {
  ERROR_INTERNAL_SERVER,
  ERROR_UNKNOWN,
  SOMEONE_LIKE_YOU,
} from "../../constants/code-response.constant";
import { NotificationEnum } from "../../constants/enum";
import { UserFriendsRepository } from "../user-friends/user-friends.repository";
import { NotificationsService } from "./../notifications/notifications.service";
import { CreateUserLikeStackDto } from "./dto/create-user-like-stack.dto";
import { UserLikeStacksRepository } from "./user-like-stacks.repository";
import { DeleteUserLikeStackDto } from "./dto/delete-user-like-stacks.dto";

@Injectable()
export class UserLikeStacksService {
  constructor(
    private readonly userLikeStacksRepository: UserLikeStacksRepository,
    private readonly notificationsService: NotificationsService,
    private readonly userFriendsRepository: UserFriendsRepository,
    private readonly connection: Connection
  ) {}
  async create(
    fromUserId: string,
    createUserLikeStackDto: CreateUserLikeStackDto
  ) {
    try {
      const result = await this.userLikeStacksRepository.save(
        this.userLikeStacksRepository.create({
          fromUserId,
          ...createUserLikeStackDto,
        })
      );
      await this.notificationsService.create(
        NotificationEnum.LIKE,
        SOMEONE_LIKE_YOU,
        result.toUserId
      );
      return responseData(result);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async getAllIdUserLiked(userId: string): Promise<string[]> {
    try {
      const likedUsers = await this.userLikeStacksRepository.find({
        where: { fromUserId: userId },
      });
      return likedUsers.map((user) => {
        return user.toUserId;
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async matchFriends() {
    try {
      const userLikeStacks = await this.userLikeStacksRepository.find();
      const matchings = [],
        idUserLikeStacks = [];
      for (let i = 0; i < userLikeStacks.length - 1; i++) {
        for (let j = i + 1; j < userLikeStacks.length; j++) {
          if (
            userLikeStacks[i].isFriend === false &&
            userLikeStacks[i]?.fromUserId === userLikeStacks[j]?.toUserId &&
            userLikeStacks[j]?.fromUserId === userLikeStacks[i]?.toUserId
          ) {
            matchings.push({
              userId: userLikeStacks[i].fromUserId,
              friendId: userLikeStacks[i].toUserId,
            });
            idUserLikeStacks.push(userLikeStacks[i].id, userLikeStacks[j].id);
          }
        }
      }
      if (matchings && idUserLikeStacks) {
        try {
          const queryRunner = this.connection.createQueryRunner();
          await queryRunner.connect();
          await queryRunner.startTransaction();
          try {
            matchings.map(async (el) => {
              await queryRunner.manager.save(
                await this.userFriendsRepository.create(el)
              );
            });
            idUserLikeStacks.map(async (el) => {
              await queryRunner.manager.update(
                UserLikeStackEntity,
                { id: el },
                {
                  isFriend: true,
                }
              );
            });
            await queryRunner.commitTransaction();
          } catch (error) {
            await queryRunner.rollbackTransaction();
          } finally {
            await queryRunner.release();
          }
        } catch (error) {
          throw new Error(error.message);
        }
      }
      return matchings;
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async getMatchingFriends(id: string) {
    try {
      return responseData(
        await this.userLikeStacksRepository.getMatchingFriends(id),
        "get success"
      );
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async remove(body: DeleteUserLikeStackDto) {
    try {
      await this.userLikeStacksRepository.delete(body.ids);
      return responseData(null, "Delete success");
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
