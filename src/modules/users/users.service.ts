import { IUserService } from "./interfaces/user-service.interface";
import { Injectable } from "@nestjs/common";
import { getDataError, getDataSuccess, signToken } from "src/common/utils";
import { ResponseDto } from "../../common/response.dto";
import { CodeStatus } from "../../constants";
import {
  CHECK_PHONE_GET_OTP,
  ERROR_UNKNOW,
  ERROR_USER_EXISTED,
} from "../../constants/code-response.constant";
import { OtpService } from "../otp/otp.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { VerifyUserDto } from "./dto/verify-user.dto";
import { UserEntity } from "./entities/user.entity";
import { UsersRepository } from "./users.repository";
import { FriendDto } from "./dto/friend.dto";
import { MatchingUsersService } from "../matching-users/matching-users.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";

@Injectable()
export class UsersService implements IUserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly otpService: OtpService,
    private matchingUsersService: MatchingUsersService,
    @InjectMapper()
    private readonly mapper: Mapper
  ) {}
  async findById(id: string): Promise<ResponseDto<UserEntity>> {
    try {
      const user = await this.usersRepository.findOne(id);
      if (!user)
        return getDataError(
          CodeStatus.NotFountException,
          "ERROR_USER_NOT_FOUND",
          null
        );
      return getDataSuccess(CodeStatus.Success, user);
    } catch (error) {
      return getDataError(
        CodeStatus.InternalServerError,
        "error_unknow",
        error
      );
    }
  }
  async getUserByPhone(phone: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ phone: phone });
    return user;
  }
  findAll(): Promise<UserEntity[]> {
    throw new Error("Method not implemented.");
  }
  async findByEmail(email: string): Promise<ResponseDto<UserEntity>> {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          email: email,
        },
      });
      if (!user)
        return getDataError(
          CodeStatus.NotFountException,
          "ERROR_USER_NOT_FOUND",
          null
        );
      return getDataSuccess(CodeStatus.Success, user);
    } catch (error) {
      return getDataError(
        CodeStatus.InternalServerError,
        "error_unknow",
        error
      );
    }
  }

  /**
   * check existed user be4 send otp
   * @param phone phone number
   * @returns error /  messge check phone
   */
  async verifyUser(dto: VerifyUserDto) {
    try {
      const userExisted = await this.usersRepository.findOne({
        phone: dto.phone,
      });
      if (userExisted) {
        return getDataError(CodeStatus.Conflict, ERROR_USER_EXISTED, "");
      }
      const result = await this.otpService.sendSmsOtp(dto.phone);
      if (result.code !== CodeStatus.Success)
        return getDataError(CodeStatus.InternalServerError, ERROR_UNKNOW, "");
      return getDataSuccess(CodeStatus.Success, CHECK_PHONE_GET_OTP);
    } catch (error) {
      return getDataError(CodeStatus.InternalServerError, ERROR_UNKNOW, null);
    }
  }
  async signUp(dto: CreateUserDto): Promise<ResponseDto<UserEntity | string>> {
    try {
      const verifyOtp = await this.otpService.confirmOtp(dto.phone, dto.otp);
      if (verifyOtp.code !== CodeStatus.Success) return verifyOtp;
      const result = await this.usersRepository.save(
        this.usersRepository.create(dto)
      );
      const jwtToken = await signToken(result.id, result.phone);
      return getDataSuccess(
        CodeStatus.Success,
        jwtToken,
        "Login luon."
      ) as ResponseDto<string>;
    } catch (error) {
      return getDataError(CodeStatus.InternalServerError, ERROR_UNKNOW, null);
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

      const listFriends = this.mapper.mapArray(
        listUserEntities,
        UserEntity,
        FriendDto
      );

      return getDataSuccess(CodeStatus.Success, listFriends, "");
    } catch (error) {
      console.log(error);
      return getDataError(
        CodeStatus.InternalServerError,
        "ERROR_UNKNOWN",
        "",
        "An error has occoured in server."
      );
    }
  }
}
