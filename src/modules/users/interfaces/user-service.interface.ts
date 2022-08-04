import { ResponseDto } from "../../../common/response.dto";
import { CreateUserDto, DeleteUserDto, UpdateUserDto } from "../dto";
import { FriendDto } from "../dto/friend.dto";
import { UserEntity } from "../entities/user.entity";

export interface IUserService {
  getAllUser(): Promise<Array<UserEntity>>;
  getPublicById(userId: string): Promise<ResponseDto<UserEntity>>;
  getUserByPhone(phone: string): Promise<UserEntity>;
  getUserByEmail(email: string): Promise<ResponseDto<UserEntity>>;
  signUp(user: CreateUserDto): Promise<ResponseDto<UserEntity | string>>;
  updateUserProfileById(
    userId: string,
    user: UpdateUserDto
  ): Promise<ResponseDto<UserEntity>>;
  deleteUserProfileById(
    userId: string,
    user: DeleteUserDto
  ): Promise<ResponseDto<UserEntity>>;
  getListFriends(id: string): Promise<ResponseDto<FriendDto[]>>;
}
