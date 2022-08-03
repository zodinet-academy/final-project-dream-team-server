import { ResponseDto } from "../../../common/response.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserEntity } from "../entities/user.entity";

export interface IUserService {
  findAll(): Promise<Array<UserEntity>>;
  signUp(user: CreateUserDto): Promise<ResponseDto<UserEntity>>;
}
