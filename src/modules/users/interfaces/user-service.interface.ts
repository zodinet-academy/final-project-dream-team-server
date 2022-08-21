import { UserEntity } from "../entities/user.entity";

import { ResponseToken } from "../../auth/interfaces/response-token.interface";
import { ResponsePublicUserInterface } from "./res-public-user.interface";

import { ResponseDto } from "../../../common/response.dto";
import { SocialDTO } from "../../auth/dto/social-login.dto";
import {
  DeleteUserDto,
  FriendDto,
  UpdateUserDto,
  UserProfileDto,
  VerifyUserDto,
} from "../dto";

export interface IUserService {
  getAllUser(): Promise<ResponseDto<UserEntity[]>>;
  getPublicById(
    userId: string
  ): Promise<ResponseDto<ResponsePublicUserInterface | null>>;
  getUserByPhone(phone: string): Promise<ResponseDto<UserEntity | null>>;
  getUserByEmail(email: string): Promise<ResponseDto<UserEntity | null>>;
  getListFriends(id: string): Promise<ResponseDto<FriendDto[]>>;

  verifyUser(dto: VerifyUserDto): Promise<ResponseDto<null>>;
  verifyUserByEmail(email: string): Promise<ResponseDto<boolean | null>>;
  signUp(
    user: SocialDTO
  ): Promise<ResponseDto<ResponseToken | string | boolean | null>>;
  updateUserProfileById(
    userId: string,
    user: UpdateUserDto,
    file: Express.Multer.File
  ): Promise<ResponseDto<string | UserProfileDto>>;
  deleteUserProfileById(
    userId: string,
    user: DeleteUserDto
  ): Promise<ResponseDto<UserEntity | null>>;
}
