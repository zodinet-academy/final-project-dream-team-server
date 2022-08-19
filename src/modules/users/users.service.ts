import { Mapper } from "@automapper/core";
import { Injectable } from "@nestjs/common";
import { InjectMapper } from "@automapper/nestjs";
import { responseData, signToken } from "../../common/utils";

import {
  CHECK_PHONE_GET_OTP,
  ERROR_CAN_NOT_CREATE_USER_HOBBY,
  ERROR_CAN_NOT_GET_USER_ALBUM,
  ERROR_CAN_NOT_GET_USER_HOBBIES,
  ERROR_CAN_NOT_UPDATE_USER_PROFILE,
  ERROR_CHANGE_USER_AVATAR,
  ERROR_MISSING_FIELD,
  ERROR_UNKNOW,
  ERROR_USER_EXISTED,
  ERROR_USER_NOT_FOUND,
} from "../../constants/code-response.constant";

import { UserEntity } from "./entities/user.entity";
import { UsersRepository } from "./users.repository";

import { ResponsePublicUserInterface } from "./interfaces";
import { IUserService } from "./interfaces/user-service.interface";
import { ResponseToken } from "../auth/interfaces/response-token.interface";

import {
  CreateUserDto,
  VerifyUserDto,
  UpdateUserDto,
  DeleteUserDto,
  FriendDto,
  UserProfileDto,
} from "./dto";
import { ResponseDto } from "../../common/response.dto";

import { OtpService } from "../otp/otp.service";
import { MatchingUsersService } from "../matching-users/matching-users.service";
import { UpdateUserProfileEnum, UserRolesEnum } from "../../constants/enum";
import { UserImagesService } from "../user-images/user-images.service";
import { UserHobbiesService } from "../user-hobbies/user-hobbies.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { CreateUserHobbiesDto } from "../user-hobbies/dto/create-user-hobbies.dto";
import { GetUserHobbiesDto } from "../user-hobbies/dto";

@Injectable()
export class UsersService implements IUserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly otpService: OtpService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly matchingUsersService: MatchingUsersService,
    private readonly userImagesService: UserImagesService,
    private readonly userHobbiesServies: UserHobbiesService,
    private readonly cloudinaryService: CloudinaryService
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

      return responseData(jwtToken, "Login luon");
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
      console.log(error);
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
    dto: UpdateUserDto,
    file: Express.Multer.File
  ): Promise<ResponseDto<string | UserProfileDto>> {
    try {
      const user = await this.usersRepository.findOne({ id: userId });
      if (!user)
        return responseData(null, "User not found", ERROR_USER_NOT_FOUND);

      const query = this.usersRepository
        .createQueryBuilder()
        .update(UserEntity);

      switch (dto.type) {
        case UpdateUserProfileEnum.ALCOHOL:
          if (dto.alcohol)
            responseData(null, "Missing file alcohol", ERROR_MISSING_FIELD);
          query.set({ alcohol: dto.alcohol });
          break;
        case UpdateUserProfileEnum.CHILDREN:
          if (dto.children)
            responseData(null, "Missing file children", ERROR_MISSING_FIELD);
          query.set({ children: dto.children });
          break;
        case UpdateUserProfileEnum.DESCRIPTION:
          if (dto.description)
            responseData(null, "Missing file description", ERROR_MISSING_FIELD);
          query.set({ description: dto.description });
          break;
        case UpdateUserProfileEnum.EDUCATION:
          if (dto.education)
            responseData(null, "Missing file education", ERROR_MISSING_FIELD);
          query.set({ education: dto.education });
          break;
        case UpdateUserProfileEnum.GENDER:
          if (dto.gender)
            responseData(null, "Missing file gender", ERROR_MISSING_FIELD);
          query.set({ gender: dto.gender });
          break;
        case UpdateUserProfileEnum.HEIGHT:
          if (dto.height)
            responseData(null, "Missing file height", ERROR_MISSING_FIELD);
          query.set({ height: dto.height });
          break;
        case UpdateUserProfileEnum.MARITAL_STATUS:
          if (dto.maritalStatus)
            responseData(
              null,
              "Missing file maritalStatus",
              ERROR_MISSING_FIELD
            );
          query.set({ maritalStatus: dto.maritalStatus });
          break;
        case UpdateUserProfileEnum.PURPOSEID:
          if (dto.purposeId)
            responseData(null, "Missing file purposeId", ERROR_MISSING_FIELD);
          query.set({ purposeId: dto.purposeId });
          break;
        case UpdateUserProfileEnum.RELIGION:
          if (dto.religion)
            responseData(null, "Missing file religion", ERROR_MISSING_FIELD);
          query.set({ religion: dto.religion });
          break;
        case UpdateUserProfileEnum.OTHER:
          {
            const newImage = await this.changeAvatar(user.avatar, file);
            console.log(newImage);
            if (!newImage)
              responseData(
                null,
                "Error change user avatar",
                ERROR_CHANGE_USER_AVATAR
              );

            query.set({
              avatar: newImage ? newImage : user.avatar,
              name: dto.name ? dto.name : user.name,
              birthday: dto.birthday ? dto.birthday : user.birthday,
            });
          }
          break;
        default:
          break;
      }

      query.where("id = :id", { id: userId });

      const { affected } = await query.execute();

      console.log(query.getSql());
      if (affected > 0) return this.getUserProfile(user.id);
    } catch (error) {
      console.log(error);
      return responseData(
        null,
        "Can not update user profile",
        ERROR_CAN_NOT_UPDATE_USER_PROFILE
      );
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

    const urlAvatar = await this.cloudinaryService.getImageUrl(user.avatar);

    user.avatar = urlAvatar;

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

  async changeAvatar(
    oldAvater: string,
    newAvatar: Express.Multer.File
  ): Promise<string> {
    const response = await this.cloudinaryService.uploadImage(
      newAvatar,
      "avatar",
      oldAvater
    );

    if (response.public_id) return response.public_id;
    return undefined;
  }

  async createUserHobby(
    userId: string,
    name: string
  ): Promise<ResponseDto<string | GetUserHobbiesDto>> {
    const user = await this.getUserById(userId);
    if (!user) return responseData("", "User not found", ERROR_USER_NOT_FOUND);

    const hobby = await this.userHobbiesServies.createUserHobby(userId, name);
    return hobby;
  }

  async deleteUserHobby(
    userId: string,
    hobbyId: string
  ): Promise<ResponseDto<string>> {
    const user = await this.getUserById(userId);
    if (!user) return responseData("", "User not found", ERROR_USER_NOT_FOUND);

    const res = await this.userHobbiesServies.deleteUserHobby(userId, hobbyId);
    return res;
  }
}
