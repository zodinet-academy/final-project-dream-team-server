import { ResponseDto } from "../../../common/response.dto";
import { CreateUserBlockDto } from "../dto/create-user-block.dto";
import { UserBlockEntity } from "../entities/user-block.entity";

export interface IUserBlocksService {
  create(
    userId: string,
    createUserBlockDto: CreateUserBlockDto
  ): Promise<ResponseDto<UserBlockEntity>>;
  getAllIdBlockedUser(userId: string): Promise<string[]>;
  getAllBlockedUser(userId: string): Promise<UserBlockEntity[]>;
}
