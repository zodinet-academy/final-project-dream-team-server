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
import { ResponsePublicUserInterface } from "./interfaces";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";

@Injectable()
export class UsersService implements IUserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly otpService: OtpService,
    @InjectMapper() private readonly mapper: Mapper
  ) {}

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

  async findAll(): Promise<UserEntity[]> {
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
      if (!user)
        return getDataError(
          CodeStatus.NotFountException,
          "ERROR_USER_NOT_FOUND",
          null
        );
      const userPublic: ResponsePublicUserInterface = {
        id: user.id,
        avatar: user.avatar,
        nickname: user.nickname,
        phone: user.phone,
        gender: user.gender,
      };
      return getDataSuccess(CodeStatus.Success, userPublic);
    } catch (error) {
      return getDataError(
        CodeStatus.InternalServerError,
        "error_unknow",
        error
      );
    }
  }

  async getUserByPhone(phone: string): Promise<UserEntity> {
    try {
      const user = await this.usersRepository.findOne({ phone: phone });

      if (!user)
        throw getDataError(
          CodeStatus.NotFountException,
          "ERROR_USER_NOT_FOUND",
          null
        );
      return user;
    } catch (error) {
      return null;
    }
  }
  async getUserByEmail(email: string): Promise<ResponseDto<UserEntity>> {
    try {
      const user = await this.usersRepository.findOne(email);
      if (!user)
        return getDataError(
          CodeStatus.NotFountException,
          "ERROR_USER_NOT_FOUND",
          null
        );
      return getDataSuccess(CodeStatus.Success, user, null);
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
      return getDataError(
        CodeStatus.NotFountException,
        "ERROR_USER_NOT_FOUND",
        null
      );
    }
  }
}
