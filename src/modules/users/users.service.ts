import { IUserService } from "./interfaces/user-service.interface";
import { Injectable } from "@nestjs/common";
import { getDataError, getDataSuccess, signToken } from "../../common/utils";
import { ResponseDto } from "../../common/response.dto";
import {
  CHECK_PHONE_GET_OTP,
  ERROR_UNKNOW,
  ERROR_USER_EXISTED,
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
} from "./dto";
import { MatchingUsersService } from "../matching-users/matching-users.service";
import { FriendDto } from "./dto/friend.dto";

@Injectable()
export class UsersService implements IUserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly otpService: OtpService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly matchingUsersService: MatchingUsersService
  ) {}

  async signUp(dto: CreateUserDto): Promise<ResponseDto<UserEntity | string>> {
    try {
      const verifyOtp = await this.otpService.confirmOtp(dto.phone, dto.otp);
      if (!verifyOtp.status) return verifyOtp;
      const result = await this.usersRepository.save(
        this.usersRepository.create(dto)
      );
      const jwtToken = await signToken(result.id, result.phone);
      return getDataSuccess(
        true,
        jwtToken,
        "Login luon."
      ) as ResponseDto<string>;
    } catch (error) {
      return getDataError(false, ERROR_UNKNOW, null);
    }
  }

  async verifyUser(dto: VerifyUserDto) {
    try {
      const userExisted = await this.usersRepository.findOne({
        phone: dto.phone,
      });
      if (userExisted) {
        return getDataError(false, ERROR_USER_EXISTED, "");
      }
      const result = await this.otpService.sendSmsOtp(dto.phone);
      if (!result.status) return getDataError(false, ERROR_UNKNOW, "");
      return getDataSuccess(true, CHECK_PHONE_GET_OTP);
    } catch (error) {
      return getDataError(false, ERROR_UNKNOW, null);
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
      if (!user) return getDataError(false, "ERROR_USER_NOT_FOUND", null);
      const userPublic: ResponsePublicUserInterface = {
        id: user.id,
        avatar: user.avatar,
        nickname: user.nickname,
        phone: user.phone,
        gender: user.gender,
      };
      return getDataSuccess(true, userPublic);
    } catch (error) {
      return getDataError(false, "error_unknow", error);
    }
  }

  async getUserByPhone(phone: string): Promise<UserEntity> {
    try {
      const user = await this.usersRepository.findOne({ phone: phone });

      if (!user) throw getDataError(false, "ERROR_USER_NOT_FOUND", null);
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
      if (!user) return getDataError(false, "ERROR_USER_NOT_FOUND", null);
      return getDataSuccess(true, user, null);
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

      return getDataSuccess(null, "Your profile has been updated!");
    } catch (error) {
      return getDataError(false, "ERROR_USER_NOT_FOUND", null);
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

      return getDataSuccess(null, "Your profile has been deleted!");
    } catch (error) {
      return getDataError(false, "ERROR_USER_NOT_FOUND", null);
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

      return getDataSuccess(
        true,
        this.mapper.mapArray(listUserEntities, UserEntity, FriendDto),
        ""
      );
    } catch (error) {
      console.log(error);
      return getDataError(
        false,
        "ERROR_UNKNOWN",
        "",
        "An error has occoured in server."
      );
    }
  }

  async verifyUserByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { email: email },
      });
      return getDataSuccess(true, {
        isNewUser: user ? false : true,
      });
    } catch (error) {
      console.log(error);
      return getDataError(
        false,
        "ERROR_UNKNOWN",
        "",
        "An error has occoured in server."
      );
    }
  }
}
