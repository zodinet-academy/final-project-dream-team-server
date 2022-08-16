import { IUserService } from "./interfaces/user-service.interface";
import { Injectable } from "@nestjs/common";
import { responseData, signToken } from "../../common/utils";
import { ResponseDto } from "../../common/response.dto";
import {
  CHECK_PHONE_GET_OTP,
  ERROR_CAN_NOT_GET_USER_ALBUM,
  ERROR_CAN_NOT_GET_USER_HOBBIES,
  ERROR_UNKNOW,
  ERROR_USER_EXISTED,
  ERROR_USER_NOT_FOUND,
} from "../../constants/code-response.constant";
import { OtpService } from "../otp/otp.service";
import { UserEntity } from "./entities/user.entity";
import { UsersRepository } from "./users.repository";
import { ResponsePublicUserInterface } from "./interfaces";
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import {
  CreateUserDto,
  VerifyUserDto,
  UpdateUserDto,
  DeleteUserDto,
  UserProfileDto,
} from "./dto";
import { MatchingUsersService } from "../matching-users/matching-users.service";
import { FriendDto } from "./dto/friend.dto";
import { UserRolesEnum } from "../../constants/enum";
import { UserImagesService } from "../user-images/user-images.service";
import { UserHobbiesService } from "../user-hobbies/user-hobbies.service";

@Injectable()
export class UsersService implements IUserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly otpService: OtpService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly matchingUsersService: MatchingUsersService,
    private readonly userImagesService: UserImagesService,
    private readonly userHobbiesServies: UserHobbiesService
  ) {}

  async signUp(dto: CreateUserDto): Promise<ResponseDto<UserEntity | string>> {
    try {
      const verifyOtp = await this.otpService.confirmOtp(dto.phone, dto.otp);
      if (!verifyOtp.status) return verifyOtp;
      const result = await this.usersRepository.save(
        this.usersRepository.create(dto)
      );
      const jwtToken = await signToken(
        result.id,
        result.phone,
        UserRolesEnum.USER
      );
      return responseData(jwtToken, "Login luon.") as ResponseDto<string>;
    } catch (error) {
      return responseData(null, null, ERROR_UNKNOW);
    }
  }

  async verifyUser(dto: VerifyUserDto) {
    try {
      const userExisted = await this.usersRepository.findOne({
        phone: dto.phone,
      });
      if (userExisted) {
        return responseData(null, "", ERROR_USER_EXISTED);
      }
      const result = await this.otpService.sendSmsOtp(dto.phone);
      if (!result.status) return responseData(null, null, ERROR_UNKNOW);
      return responseData(CHECK_PHONE_GET_OTP);
    } catch (error) {
      return responseData(null, null, ERROR_UNKNOW);
    }
  }

  async getAllUser(): Promise<UserEntity[]> {
    try {
      const users = await this.usersRepository.find();
      return users;
    } catch (error) {
      return [];
    }
  }

  async getPublicById(id: string): Promise<ResponseDto<UserEntity>> {
    try {
      const user = await this.usersRepository.findOne(id);
      if (!user) return responseData(null, null, "ERROR_USER_NOT_FOUND");
      const userPublic: ResponsePublicUserInterface = {
        id: user.id,
        avatar: user.avatar,
        phone: user.phone,
        gender: user.gender,
      };
      return responseData(userPublic);
    } catch (error) {
      return responseData(null, null, "error_unknow");
    }
  }

  async getUserByPhone(phone: string): Promise<UserEntity> {
    try {
      const user = await this.usersRepository.findOne({ phone: phone });
      if (!user) throw responseData(null, null, "ERROR_USER_NOT_FOUND");
      return user;
    } catch (error) {
      return null;
    }
  }
  async getUserByEmail(email: string): Promise<ResponseDto<UserEntity>> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email: email },
      });
      if (!user) return responseData(null, null, "ERROR_USER_NOT_FOUND");
      return responseData(user, null);
    } catch (error) {
      return error;
    }
  }

  async updateUserProfileById(
    userId: string,
    dto: UpdateUserDto
  ): Promise<ResponseDto<UserEntity>> {
    try {
      const userInfo: UserEntity = await this.usersRepository.findOne(userId);

      if (userInfo) {
        await this.usersRepository.update(userId, {
          ...(dto.fullname && { fullname: dto.fullname }),
          ...(dto.gender && { gender: dto.gender }),
        });
      }

      return responseData(null, "Your profile has been updated!");
    } catch (error) {
      return responseData(null, null, "ERROR_USER_NOT_FOUND");
    }
  }

  async deleteUserProfileById(
    userId: string,
    dto: DeleteUserDto
  ): Promise<ResponseDto<UserEntity>> {
    try {
      const userInfo: UserEntity = await this.usersRepository.findOne(userId);

      if (
        userInfo &&
        userInfo.email === dto.email &&
        userInfo.phone === dto.phone
      ) {
        await this.usersRepository.delete(userId);
      }

      return responseData(null, "Your profile has been deleted!");
    } catch (error) {
      return responseData(null, null, "ERROR_USER_NOT_FOUND");
    }
  }

  async getListFriends(id: string): Promise<ResponseDto<FriendDto[]>> {
    try {
      const listFriendsId = await this.matchingUsersService.getListFriendsId(
        id
      );

      const listUserEntities = await this.usersRepository.getListFriends(
        listFriendsId
      );

      return responseData(
        this.mapper.mapArray(listUserEntities, UserEntity, FriendDto),
        ""
      );
    } catch (error) {
      console.log(error);
      return responseData(null, null, "ERROR_UNKNOWN");
    }
  }

  async verifyUserByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { email: email },
      });
      return responseData({
        isNewUser: user ? false : true,
      });
    } catch (error) {
      console.log(error);
      return responseData(null, null, "ERROR_UNKNOWN");
    }
  }

  async getUserById(userId: string): Promise<UserProfileDto | undefined> {
    const user = await this.usersRepository.findOne({ id: userId });

    if (!user) return undefined;

    const userProfile = this.mapper.map(user, UserEntity, UserProfileDto);

    return userProfile;
  }

  async getUserProfile(
    userId: string
  ): Promise<ResponseDto<UserProfileDto | string>> {
    const user = await this.getUserById(userId);

    if (!user)
      return responseData(null, "User not found", ERROR_USER_NOT_FOUND);

    const album = await this.userImagesService.getUserAlbum(user.id);
    if (!album)
      responseData(
        null,
        "Can not get user album",
        ERROR_CAN_NOT_GET_USER_ALBUM
      );

    user.album = album;

    const hobbies = await this.userHobbiesServies.getUserHobbies(user.id);
    if (!hobbies)
      responseData(
        null,
        "Can not get user hobbies",
        ERROR_CAN_NOT_GET_USER_HOBBIES
      );

    user.hobbies = hobbies;

    return responseData(user);
  }
}
