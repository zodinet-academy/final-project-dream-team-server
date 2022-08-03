import { Injectable } from "@nestjs/common";
import { getDataError, getDataSuccess } from "src/common/utils";
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
import { IUserService } from "./interfaces/user-service.interface";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService implements IUserService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly otpService: OtpService
  ) {}
  findById(id: string): Promise<ResponseDto<UserEntity>> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<UserEntity[]> {
    throw new Error("Method not implemented.");
  }
  private async findUserByPhone(phone: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOne({
        phone: phone,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   * check existed user be4 send otp
   * @param phone phone number
   * @returns error /  messge check phone
   */
  async verifyUser(dto: VerifyUserDto) {
    try {
      const userExisted = await this.userRepository.findOne({
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
  async signUp(dto: CreateUserDto): Promise<ResponseDto<UserEntity>> {
    try {
      const verifyOtp = await this.otpService.confirmOtp(dto.phone, dto.otp);
      if (verifyOtp.code !== CodeStatus.Success) return verifyOtp;
      const result = await this.userRepository.save(
        this.userRepository.create(dto)
      );
      return getDataSuccess(CodeStatus.Created, result);
    } catch (error) {
      return getDataError(CodeStatus.InternalServerError, ERROR_UNKNOW, null);
    }
  }
}
