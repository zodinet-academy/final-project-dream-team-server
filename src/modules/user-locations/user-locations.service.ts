import { UserLikeStacksService } from "./../user-like-stacks/user-like-stacks.service";
import { UserBlocksService } from "./../user-blocks/user-blocks.service";
import { Point } from "geojson";
import { Injectable } from "@nestjs/common";
import { responseData } from "../../common/utils";
import {
  ERROR_DATA_NOT_FOUND,
  ERROR_UNKNOWN,
} from "./../../constants/code-response.constant";
import { CreateUserLocationDto } from "./dto/create-user-location.dto";
import { UserLocationEntity } from "./entities/user-location.entity";
import { IFriendNearUser, IOrigin, IUserLocationsService } from "./interfaces";
import { UserLocationsRepository } from "./user-locations.repository";
import { ResponseDto } from "../../common/response.dto";
import { SettingEntity } from "../settings/entities/setting.entity";
import { SettingsService } from "../settings/settings.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Injectable()
export class UserLocationsService implements IUserLocationsService {
  constructor(
    private readonly userLocationsRepository: UserLocationsRepository,
    private readonly settingsService: SettingsService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly userBlocksService: UserBlocksService,
    private readonly userLikeStacksService: UserLikeStacksService
  ) {}

  /**
   * Create/ update user locations
   * @param createUserLocationDto
   * @returns ResponseDto<UserLocationEntity | string>
   */
  public async createOrUpdate(
    userId: string,
    createUserLocationDto: CreateUserLocationDto
  ): Promise<ResponseDto<UserLocationEntity | string>> {
    try {
      const findData = await this.userLocationsRepository.findOne({
        userId: userId,
      });

      const pointObject: Point = {
        type: "Point",
        coordinates: [
          createUserLocationDto.longtitude,
          createUserLocationDto.latitude,
        ],
      };

      if (!findData)
        return responseData(
          await this.userLocationsRepository.save(
            this.userLocationsRepository.create({
              userId,
              location: pointObject,
              ...createUserLocationDto,
            })
          )
        );

      return responseData(
        await this.userLocationsRepository.save({
          id: findData.id,
          location: pointObject,
          ...createUserLocationDto,
        })
      );
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  /**
   * Get current user location
   * @param userId
   * @returns ResponseDto<UserLocationEntity | string>
   */
  async getUserLocation(
    userId: string
  ): Promise<ResponseDto<string | UserLocationEntity>> {
    try {
      const findData: UserLocationEntity = await this.userLocationsRepository.findOne(
        {
          userId: userId,
        }
      );
      if (!findData) return responseData(null, null, ERROR_DATA_NOT_FOUND);
      return responseData(findData, "Get user location success");
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }
  /**
   * Get all friend near user within 3km radius
   * @param userId
   * @returns response dto with list friend near user
   */
  async getFriendNearUser(
    userId: string
  ): Promise<ResponseDto<IFriendNearUser[] | string | SettingEntity>> {
    try {
      const findData: UserLocationEntity = await this.userLocationsRepository.findOne(
        {
          userId: userId,
        }
      );
      if (!findData) return responseData(null, null, ERROR_DATA_NOT_FOUND);

      const findSetting: ResponseDto<
        SettingEntity | string
      > = await this.settingsService.findSetting();
      if (!findSetting.status) return findSetting;

      const { radius } = findSetting.data as SettingEntity;

      const origin: IOrigin = {
        type: "Point",
        coordinates: [findData.longtitude, findData.latitude],
      };

      const blockedUsers = await this.userBlocksService.getAllIdBlockedUser(
        userId
      );

      const likedUsers = await this.userLikeStacksService.getAllIdUserLiked(
        userId
      );

      const result: IFriendNearUser[] = await this.userLocationsRepository.getFriendNearUser(
        radius,
        origin,
        blockedUsers,
        likedUsers
      );
      const data = result.filter((el) => el.id !== userId);
      data &&
        data.map(async (el) => {
          el.avatar = await this.cloudinaryService.getImageUrl(el.avatar);
          if (el.distance >= 1000) {
            el.distance = +(el.distance / 1000).toFixed(1);
            el.unit = "km";
          } else {
            el.distance = +el.distance.toFixed(1);
            el.unit = "m";
          }
        });

      return responseData(data, "Get friend near user success");
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} userLocation`;
  }

  remove(id: number) {
    return `This action removes a #${id} userLocation`;
  }
}
