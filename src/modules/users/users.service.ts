import { Mapper } from "@automapper/core";
import { Injectable } from "@nestjs/common";
import { InjectMapper } from "@automapper/nestjs";
import { responseData } from "../../common/utils";

import {
  CHECK_PHONE_GET_OTP,
  ERROR_UNKNOWN,
  ERROR_DATA_NOT_FOUND,
  ERROR_CAN_NOT_GET_USER_ALBUM,
  ERROR_CAN_NOT_GET_USER_HOBBIES,
  ERROR_CAN_NOT_UPDATE_USER_PROFILE,
  ERROR_CHANGE_USER_AVATAR,
  ERROR_MISSING_FIELD,
  ERROR_USER_EXISTED,
  ERROR_USER_NOT_FOUND,
} from "../../constants/code-response.constant";

import { UserEntity } from "./entities/user.entity";
import { UsersRepository } from "./users.repository";

import { ResponsePublicUserInterface } from "./interfaces";
import { IUserService } from "./interfaces/user-service.interface";

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

import { SocialDTO } from "../auth/dto/social-login.dto";
import { UserResponeDTO } from "./dto/user-respone.dto";
import { JwtService } from "@nestjs/jwt";
import { IJwtPayloadDreamtem } from "../auth/interfaces/jwt-payload.interface";

import { UpdateUserProfileEnum, UserRolesEnum } from "../../constants/enum";
import { UserImagesService } from "../user-images/user-images.service";
import { UserHobbiesService } from "../user-hobbies/user-hobbies.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { GetUserHobbiesDto } from "../user-hobbies/dto";

@Injectable()
export class UsersService implements IUserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly matchingUsersService: MatchingUsersService,
    private readonly userImagesService: UserImagesService,
    private readonly userHobbiesServies: UserHobbiesService,
    private readonly cloudinaryService: CloudinaryService
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
      const newDate = bthdayFormart.split("/").reverse().join("/");
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
        role: UserRolesEnum.USER,
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
