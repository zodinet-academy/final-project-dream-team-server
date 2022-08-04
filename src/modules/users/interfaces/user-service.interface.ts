import { ResponseDto } from "../../../common/response.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserEntity } from "../entities/user.entity";

export interface IUserService {
  findAll(): Promise<Array<UserEntity>>;
  getPublicById(id: string): Promise<ResponseDto<UserEntity>>;
  getUserByPhone(phone: string): Promise<UserEntity>;
  getUserByEmail(email: string): Promise<ResponseDto<UserEntity>>;
  signUp(user: CreateUserDto): Promise<ResponseDto<UserEntity | string>>;
}
