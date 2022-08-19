import { UserEntity } from "../entities/user.entity";

import { ResponsePublicUserInterface } from "./res-public-user.interface";
import { ResponseToken } from "../../auth/interfaces/response-token.interface";

import { ResponseDto } from "../../../common/response.dto";
import {
  CreateUserDto,
  DeleteUserDto,
  UpdateUserDto,
  FriendDto,
  UserProfileDto,
} from "../dto";

export interface IUserService {
  getAllUser(): Promise<Array<UserEntity>>;
  getPublicById(
    userId: string
  ): Promise<ResponseDto<ResponsePublicUserInterface | null>>;
  getUserByPhone(phone: string): Promise<UserEntity>;
  getUserByEmail(email: string): Promise<ResponseDto<UserEntity>>;
  signUp(
    user: CreateUserDto
  ): Promise<ResponseDto<ResponseToken | string | boolean | null>>;
  updateUserProfileById(
    userId: string,
    user: UpdateUserDto,
    file: Express.Multer.File
  ): Promise<ResponseDto<string | UserProfileDto>>;
  deleteUserProfileById(
    userId: string,
    user: DeleteUserDto
  ): Promise<ResponseDto<UserEntity>>;
  getListFriends(id: string): Promise<ResponseDto<FriendDto[]>>;
}
