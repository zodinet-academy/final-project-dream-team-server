import { Injectable } from "@nestjs/common";
import { responseData } from "../../common/utils";
import {
  ERROR_UNKNOWN,
  SOMEONE_LIKE_YOU,
} from "../../constants/code-response.constant";
import { NotificationEnum } from "../../constants/enum";
import { NotificationsService } from "./../notifications/notifications.service";
import { UserFriendsService } from "./../user-friends/user-friends.service";
import { CreateUserLikeStackDto } from "./dto/create-user-like-stack.dto";
import { UserLikeStacksRepository } from "./user-like-stacks.repository";

@Injectable()
export class UserLikeStacksService {
  constructor(
    private readonly userLikeStacksRepository: UserLikeStacksRepository,
    private readonly notificationsService: NotificationsService,
    private readonly userFriendsService: UserFriendsService
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

  async matchFriend() {
    try {
      const userLikeStacks = await this.userLikeStacksRepository.find();
      const matchings = [],
        idUserLikeStacks = [];
      for (let i = 0; i < userLikeStacks.length - 1; i++) {
        for (let j = i + 1; j < userLikeStacks.length; j++) {
          if (
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
      matchings &&
        (await this.userFriendsService.createManyUserFriends(matchings));
      idUserLikeStacks.length && (await this.remove(idUserLikeStacks));
      return matchings;
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  findAll() {
    return `This action returns all userLikeStacks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userLikeStack`;
  }

  update(id: number) {
    return `This action updates a #${id} userLikeStack`;
  }

  async remove(id: string[]) {
    try {
      console.log(id);

      await this.userLikeStacksRepository.delete(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
