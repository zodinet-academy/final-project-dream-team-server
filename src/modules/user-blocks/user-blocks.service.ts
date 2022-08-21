import { Injectable } from "@nestjs/common";
import { ResponseDto } from "../../common/response.dto";
import { responseData } from "../../common/utils";
import { ERROR_UNKNOWN } from "../../constants/code-response.constant";
import { CreateUserBlockDto } from "./dto/create-user-block.dto";
import { UserBlockEntity } from "./entities/user-block.entity";
import { IUserBlocksService } from "./interfaces/user-blocks-service.interface";
import { UserBlocksRepository } from "./user-blocks.repository";

@Injectable()
export class UserBlocksService implements IUserBlocksService {
  constructor(private readonly userBlocksRepository: UserBlocksRepository) {}

  async create(
    userId: string,
    createUserBlockDto: CreateUserBlockDto
  ): Promise<ResponseDto<UserBlockEntity>> {
    try {
      return responseData(
        await this.userBlocksRepository.save(
          this.userBlocksRepository.create({
            userId,
            ...createUserBlockDto,
          })
        )
      );
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async getAllIdBlockedUser(userId: string): Promise<string[]> {
    try {
      const blockedUsers = await this.userBlocksRepository.find({
        where: { userId: userId },
      });
      return blockedUsers.map((user) => {
        return user.blockedUserId;
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllBlockedUser(userId: string): Promise<UserBlockEntity[]> {
    try {
      return await this.userBlocksRepository.find({
        where: { userId: userId },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
