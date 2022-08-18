import { Mapper } from "@automapper/core";
import { Injectable } from "@nestjs/common";
import { InjectMapper } from "@automapper/nestjs";
import { responseData, signToken } from "../../common/utils";

import {
  CHECK_PHONE_GET_OTP,
  ERROR_DATA_NOT_FOUND,
  ERROR_UNKNOW,
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
import { SocialDTO } from "../auth/dto/social-login.dto";
import { UserResponeDTO } from "./dto/user-respone.dto";
import { JwtService } from "@nestjs/jwt";
import { IJwtPayloadDreamtem } from "../auth/interfaces/jwt-payload.interface";

@Injectable()
export class UsersService implements IUserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly matchingUsersService: MatchingUsersService
  ) {}

  async signUp(dto: SocialDTO) {
    const { email, name, url } = dto;

    const isExist = await this.usersRepository.findOne({
      where: { email: email },
    });

    if (isExist) return responseData(null, null, ERROR_USER_EXISTED);

    const userCreated: UserEntity = await this.usersRepository.save({
      email,
      name,
      avatar: url,
    });
    return responseData(
      this.mapper.map(userCreated, UserEntity, UserResponeDTO),
      ""
    );
  }

  async updateUserAfterVerifyOTP(data: CreateUserDto) {
    try {
      const { email, gender, name, birthday } = data;
      const userFound = await this.usersRepository.findOne({
        where: { phone: data.phone },
      });
      if (!userFound) return responseData(null, ERROR_DATA_NOT_FOUND);
      const bthdayFormart = birthday.toString();
      const newDate = bthdayFormart.split("-").reverse().join("-");
      const newUser = await this.usersRepository.save({
        ...userFound,
        email,
        gender,
        name,
        birthday: newDate,
      });
      const userRes = this.mapper.map(newUser, UserEntity, UserResponeDTO);
      const payload: IJwtPayloadDreamtem = {
        id: newUser.id,
        phone: newUser.phone,
        role: newUser.role,
      };
      const token = this.jwtService.sign(payload);
      const respone = {
        userRes,
        token,
      };
      return responseData(respone, "Create User Successfull");
    } catch (err: unknown) {
      return err as string;
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

  // async updateUserProfileById(
  //   userId: string,
  //   dto: UpdateUserDto
  // ): Promise<ResponseDto<UserEntity>> {
  //   try {
  //     const userInfo: UserEntity = await this.usersRepository.findOne(userId);

  //     if (userInfo) {
  //       await this.usersRepository.update(userId, {
  //         ...(dto.name && { name: dto.name }),
  //         ...(dto.gender && { gender: dto.gender }),
  //       });
  //     }

  //     return responseData(null, "Your profile has been updated!");
  //   } catch (error) {
  //     return responseData(null, null, "ERROR_USER_NOT_FOUND");
  //   }
  // }

  async deleteUserProfileById(
    userId: string,
    dto: DeleteUserDto
  ): Promise<ResponseDto<UserEntity>> {
    return null;
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

  async getUserByGetProfile(id: string) {
    try {
      const userProfile = await this.usersRepository.findOne({ where: { id } });
      const newDate = this.formartDate(userProfile.birthday);
      const userPraseBirthday = { ...userProfile, birthday: newDate };
      return responseData(userPraseBirthday);
    } catch (err: unknown) {
      return responseData(err as string);
    }
  }

  private formartDate(newDate: Date) {
    const objDate = {
      d: null,
      m: null,
      y: null,
    };
    objDate.d = newDate.getDate();
    objDate.m = newDate.getMonth() + 1;
    objDate.y = newDate.getFullYear();
    objDate.d = objDate.d.toString().padStart(2, "0");
    objDate.m = objDate.m.toString().padStart(2, "0");
    return `${objDate.d}/${objDate.m}/${objDate.y}`;
  }
}
