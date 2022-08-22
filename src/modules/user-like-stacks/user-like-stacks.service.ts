import { NotificationsService } from "./../notifications/notifications.service";
import { Injectable } from "@nestjs/common";
import { responseData } from "../../common/utils";
import {
  ERROR_UNKNOWN,
  SOMEONE_LIKE_YOU,
} from "../../constants/code-response.constant";
import { CreateUserLikeStackDto } from "./dto/create-user-like-stack.dto";
import { UpdateUserLikeStackDto } from "./dto/update-user-like-stack.dto";
import { UserLikeStacksRepository } from "./user-like-stacks.repository";
import { NotificationEnum } from "../../constants/enum";

@Injectable()
export class UserLikeStacksService {
  constructor(
    private readonly userLikeStacksRepository: UserLikeStacksRepository,
    private readonly notificationsService: NotificationsService
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
    // const listUserLike = await this.userLikeStacksRepository.find();
    // if (listUserLike.length > 1) {
    //   listUserLike.map(async (user) => {
    //     const result = await this.userLikeStacksRepository.findAndCount({
    //       where: {
    //         fromUserId: user.toUserId,
    //         toUserId: user.fromUserId,
    //       },
    //     });
    //     if (result[1]) {
    //       arr.push(user);
    //     }
    //     console.log(result);
    //   });
    // }
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

  remove(id: number) {
    return `This action removes a #${id} userLikeStack`;
  }
}
