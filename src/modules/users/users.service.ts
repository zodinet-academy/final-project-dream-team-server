import { Mapper } from "@automapper/core";
import { Injectable } from "@nestjs/common";
import { InjectMapper } from "@automapper/nestjs";
import { responseData, signToken } from "../../common/utils";

import {
  CHECK_PHONE_GET_OTP,
  ERROR_UNKNOWN,
  ERROR_USER_EXISTED,
} from "../../constants/code-response.constant";

import { UserEntity } from "./entities/user.entity";
import { UsersRepository } from "./users.repository";
import { UserRolesEnum } from "../../constants/enum";

import { ResponsePublicUserInterface } from "./interfaces";
import { IUserService } from "./interfaces/user-service.interface";
import { ResponseToken } from "../auth/interfaces/response-token.interface";

import {
  CreateUserDto,
  VerifyUserDto,
  UpdateUserDto,
  DeleteUserDto,
  FriendDto,
} from "./dto";
import { ResponseDto } from "../../common/response.dto";

import { OtpService } from "../otp/otp.service";
import { MatchingUsersService } from "../matching-users/matching-users.service";

@Injectable()
export class UsersService implements IUserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly otpService: OtpService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly matchingUsersService: MatchingUsersService
  ) {}

  async signUp(
    dto: CreateUserDto
  ): Promise<ResponseDto<ResponseToken | string | boolean | null>> {
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

      return responseData(jwtToken, "Login Success");
    } catch (error) {
      return responseData(null, null, ERROR_UNKNOWN);
    }
  }

  async verifyUser(dto: VerifyUserDto): Promise<ResponseDto<null>> {
    try {
      const userExisted = await this.usersRepository.findOne({
        phone: dto.phone,
      });

      if (userExisted) {
        return responseData(null, "", ERROR_USER_EXISTED);
      }

      const result = await this.otpService.sendSmsOtp(dto.phone);
      if (!result.status) return responseData(null, null, ERROR_UNKNOWN);

      return responseData(null, "", CHECK_PHONE_GET_OTP);
    } catch (error) {
      return responseData(null, null, ERROR_UNKNOWN);
    }
  }

  async getAllUser(): Promise<ResponseDto<UserEntity[]>> {
    try {
      const users = await this.usersRepository.find();
      return responseData(users);
    } catch (error) {
      return responseData([]);
    }
  }

  async getPublicById(
    id: string
  ): Promise<ResponseDto<ResponsePublicUserInterface | null>> {
    try {
      const user = await this.usersRepository.findOne(id);
      if (!user) return responseData(null, null, "ERROR_USER_NOT_FOUND");
      const userPublic: ResponsePublicUserInterface = {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        phone: user.phone,
        gender: user.gender,
      };
      return responseData(userPublic);
    } catch (error) {
      return responseData(null, null, ERROR_UNKNOWN);
    }
  }

  async getUserByPhone(phone: string): Promise<ResponseDto<UserEntity | null>> {
    try {
      const user = await this.usersRepository.findOne({ phone: phone });

      if (!user) throw responseData(null, null, "ERROR_USER_NOT_FOUND");
      return responseData(user);
    } catch (error) {
      return responseData(null, null, ERROR_UNKNOWN);
    }
  }

  async getUserByEmail(email: string): Promise<ResponseDto<UserEntity | null>> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email: email },
      });
      if (!user) return responseData(null, null, "ERROR_USER_NOT_FOUND");
      return responseData(user);
    } catch (error) {
      return responseData(null, null, ERROR_UNKNOWN);
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
        this.mapper.mapArray(listUserEntities, UserEntity, FriendDto)
      );
    } catch (error) {
      return responseData(null, null, "ERROR_UNKNOWN");
    }
  }

  async updateUserProfileById(
    userId: string,
    dto: UpdateUserDto
  ): Promise<ResponseDto<UserEntity | null>> {
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
  ): Promise<ResponseDto<UserEntity | null>> {
    try {
      const userInfo: UserEntity = await this.usersRepository.findOne(userId);

      if (userInfo.email === dto.email && userInfo.phone === dto.phone) {
        await this.usersRepository.delete(userId);
      }

      return responseData(null, "Your profile has been deleted!");
    } catch (error) {
      return responseData(null, null, "ERROR_USER_NOT_FOUND");
    }
  }

  async verifyUserByEmail(email: string): Promise<ResponseDto<boolean | null>> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email: email },
      });
      const isUser = user ? false : true;

      return responseData(isUser);
    } catch (error) {
      return responseData(null, null, ERROR_UNKNOWN);
    }
  }
}
