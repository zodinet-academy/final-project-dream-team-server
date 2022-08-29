import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { responseData } from "../../common/utils";

import {
  CHECK_PHONE_GET_OTP,
  ERROR_CAN_NOT_BLOCK_WHEN_IS_NOT_VERIFIED,
  ERROR_CAN_NOT_GET_USER_ALBUM,
  ERROR_CAN_NOT_GET_USER_HOBBIES,
  ERROR_CAN_NOT_UPDATE_USER_PROFILE,
  ERROR_CHANGE_USER_AVATAR,
  ERROR_DATA_NOT_FOUND,
  ERROR_EMAIL_CONFLICT,
  ERROR_MISSING_FIELD,
  ERROR_UNKNOWN,
  ERROR_USER_EXISTED,
  ERROR_USER_NOT_FOUND,
} from "../../constants/code-response.constant";

import { UserEntity } from "./entities/user.entity";
import { UsersRepository } from "./users.repository";

import { ResponsePublicUserInterface } from "./interfaces";
import { IUserService } from "./interfaces/user-service.interface";

import { ResponseDto } from "../../common/response.dto";
import {
  CreateUserDto,
  UpdateUserDto,
  UserProfileDto,
  VerifyUserDto,
} from "./dto";

import { MatchingUsersService } from "../matching-users/matching-users.service";
import { OtpService } from "../otp/otp.service";

import { JwtService } from "@nestjs/jwt";
import { SocialDTO } from "../auth/dto/social-login.dto";
import { IJwtPayloadDreamteam } from "../auth/interfaces/jwt-payload.interface";
import { UserResponeDTO } from "./dto/user-respone.dto";

import { UpdateUserProfileEnum, UserRolesEnum } from "../../constants/enum";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { GetUserHobbiesDto } from "../user-hobbies/dto";
import { UserHobbiesService } from "../user-hobbies/user-hobbies.service";
import { UserImagesDto } from "../user-images/dto";
import { UserImagesService } from "../user-images/user-images.service";
import { UserResponseAdminDto } from "./dto/user-response-admin.dto";

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

  async signUp(dto: SocialDTO): Promise<ResponseDto<UserResponeDTO>> {
    const { birthday, email } = dto;

    const isExist = await this.usersRepository.findOne({
      where: { email: email },
    });

    if (isExist)
      return responseData(
        this.mapper.map(isExist, UserEntity, UserResponeDTO),
        ""
      );
    const bthdayFormart = birthday.toString();
    const newDate = bthdayFormart.split("/").reverse().join("/");
    const userCreated: UserEntity = await this.usersRepository.save({
      ...dto,
      birthday: new Date(newDate),
      avatar: dto.url,
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
      if (!userFound) {
        return responseData(
          null,
          "ERROR_USER_NOT_EXIST",
          "ERROR_USER_NOT_EXIST"
        );
      }
      // check existed email
      const checkEmail = await this.usersRepository.findOne({
        where: {
          email: data.email,
        },
      });

      if (checkEmail && checkEmail.email === data.email) {
        return responseData(null, ERROR_EMAIL_CONFLICT, ERROR_EMAIL_CONFLICT);
      }
      const bthdayFormart = birthday.toString();
      const newDate = bthdayFormart.split("/").reverse().join("/");
      const newUser = await this.usersRepository.save({
        ...userFound,
        email,
        gender,
        name,
        birthday: new Date(newDate),
      });
      const userRes = this.mapper.map(newUser, UserEntity, UserResponeDTO);
      const payload: IJwtPayloadDreamteam = {
        id: newUser.id,
        phone: newUser.phone,
        role: UserRolesEnum.USER,
        isBlock: false,
      };
      const token = this.jwtService.sign(payload);
      const respone = {
        userRes,
        token,
      };
      return responseData(respone, "Create User Successfull");
    } catch (err: unknown) {
      console.log(err);
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

  async getAllUser(): Promise<ResponseDto<UserResponseAdminDto[]>> {
    try {
      const users = await this.usersRepository.find();
      const res = this.mapper.mapArray(users, UserEntity, UserResponseAdminDto);

      res.forEach(async (user) => {
        const avatarUrl = await this.cloudinaryService.getImageUrl(user.avatar);
        user.avatar = avatarUrl;
      });

      return responseData(res);
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
      console.log(error);

      return responseData(null, null, ERROR_UNKNOWN);
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
            if (file) {
              const newImage = await this.changeAvatar(user.avatar, file);
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
            } else {
              query.set({
                name: dto.name ? dto.name : user.name,
                birthday: dto.birthday ? dto.birthday : user.birthday,
              });
            }
          }
          break;
        default:
          break;
      }

      query.where("id = :id", { id: userId });

      const { affected } = await query.execute();

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

  // async deleteUserProfileById(id: string): Promise<ResponseDto<string>> {
  // 	try {
  // 		const user = await this.getUserById(id);
  // 		if (!user)
  // 			return responseData(null, "User not found", ERROR_USER_NOT_FOUND);

  // 		const resultDeleteHobbies = await this.userHobbiesServies.deleteUserHobbies(
  // 			id
  // 		);
  // 		if (!resultDeleteHobbies.status) return resultDeleteHobbies;

  // 		const resultDeleteImages = await this.userImagesService.deleteImages(id);
  // 		if (!resultDeleteImages.status) return resultDeleteImages;

  // 		await this.usersRepository.delete({ id: id });

  // 		return responseData(id, "Delete user success");
  // 	} catch (error) {
  // 		console.log(error);
  // 		return responseData(null, "Can not delete user profile", ERROR_UNKNOWN);
  // 	}
  // }

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

  async addImages(
    userId: string,
    images: Array<Express.Multer.File>
  ): Promise<ResponseDto<string | UserImagesDto[]>> {
    const user = await this.getUserById(userId);
    if (!user) return responseData("", "User not found", ERROR_USER_NOT_FOUND);

    const res = await this.userImagesService.addImages(userId, images);
    if (!res.status) return res;

    const album = await this.userImagesService.getUserAlbum(userId);
    return responseData(album);
  }

  async changeImageFavorite(
    imageId: string,
    userId: string
  ): Promise<ResponseDto<string | UserImagesDto>> {
    const user = await this.getUserById(userId);
    if (!user) return responseData("", "User not found", ERROR_USER_NOT_FOUND);

    const res = await this.userImagesService.changeFavorite(imageId, userId);

    return res;
  }

  async deleteImage(
    userId: string,
    imageId: string
  ): Promise<ResponseDto<string>> {
    const user = await this.getUserById(userId);
    if (!user) return responseData("", "User not found", ERROR_USER_NOT_FOUND);

    const res = await this.userImagesService.deleteImage(userId, imageId);

    return res;
  }

  async checkUserIsBlock(id: string): Promise<boolean | ResponseDto<string>> {
    try {
      const isBlocked = await this.usersRepository.findOne(id);
      return isBlocked.isBlock;
    } catch (error) {
      console.log(error);
      return responseData(null, ERROR_UNKNOWN, ERROR_UNKNOWN);
    }
  }

  async getFriendProfile(
    id: string
  ): Promise<ResponseDto<UserProfileDto | string>> {
    const user = await this.getUserById(id);

    if (!user)
      return responseData(null, "User not found", ERROR_USER_NOT_FOUND);

    const urlAvatar = await this.cloudinaryService.getImageUrl(user.avatar);

    user.avatar = urlAvatar;

    const album = await this.userImagesService.getUserAlbum(user.id, true);
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

  async blockUser(userId: string): Promise<ResponseDto<string>> {
    try {
      const user = await this.getUserById(userId);
      if (!user)
        return responseData(null, "User not found", ERROR_USER_NOT_FOUND);

      if (!user.isVerify)
        return responseData(
          null,
          "Can not block when user is not verified.",
          ERROR_CAN_NOT_BLOCK_WHEN_IS_NOT_VERIFIED
        );

      await this.usersRepository.update({ id: userId }, { isBlock: true });

      return responseData(userId, "Block user success");
    } catch (error) {
      return responseData(null, "Can not block user", ERROR_UNKNOWN);
    }
  }

  async unblockUser(userId: string): Promise<ResponseDto<string>> {
    try {
      const user = await this.getUserById(userId);
      if (!user)
        return responseData(null, "User not found", ERROR_USER_NOT_FOUND);

      await this.usersRepository.update({ id: userId }, { isBlock: false });

      return responseData(userId, "unblock user success");
    } catch (error) {
      return responseData(null, "Can not unblock user", ERROR_UNKNOWN);
    }
  }
}
