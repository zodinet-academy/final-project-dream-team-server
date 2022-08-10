import { Point } from "geojson";
import { Injectable } from "@nestjs/common";
import { ResponseDto } from "../../common/response.dto";
import { getDataError, getDataSuccess } from "../../common/utils";
import { SettingEntity } from "../settings/entities/setting.entity";
import { SettingsService } from "../settings/settings.service";
import {
  ERROR_DATA_NOT_FOUND,
  ERROR_UNKNOW,
} from "./../../constants/code-response.constant";
import { CreateUserLocationDto } from "./dto/create-user-location.dto";
import { UserLocationEntity } from "./entities/user-location.entity";
import { IUserLocationsService } from "./interfaces";
import { UserLocationsRepository } from "./user-locations.repository";

@Injectable()
export class UserLocationsService implements IUserLocationsService {
  constructor(
    private readonly userLocationsRepository: UserLocationsRepository,
    private readonly settingsService: SettingsService
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
        coordinates: [createUserLocationDto.long, createUserLocationDto.lat],
      };

      if (!findData)
        return getDataSuccess(
          true,
          await this.userLocationsRepository.save(
            this.userLocationsRepository.create({
              userId,
              location: pointObject,
              ...createUserLocationDto,
            })
          )
        );

      return getDataSuccess(
        true,
        await this.userLocationsRepository.save({
          id: findData.id,
          location: pointObject,
          ...createUserLocationDto,
        })
      );
    } catch (error) {
      return getDataError(false, ERROR_UNKNOW, error.message);
    }
  }

  async findAllByDistance(userId: string) {
    try {
      const findData = await this.userLocationsRepository.findOne({
        userId: userId,
      });
      if (!findData) return getDataError(false, ERROR_DATA_NOT_FOUND, "");

      const findSetting: ResponseDto<
        SettingEntity | string
      > = await this.settingsService.findSetting();
      if (!findSetting.status) return findSetting;
      const { radius } = findSetting.data as SettingEntity;

      const origin = {
        type: "Point",
        coordinates: [findData.long, findData.lat],
      };
      const locations = await this.userLocationsRepository
        .createQueryBuilder("user_locations")
        .select([
          "user_locations.userId",
          "user_locations.lat",
          "user_locations.long",
          "ST_Distance(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location)))/1000 AS distance",
        ])
        .where(
          "ST_DWithin(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location)) ,:range)"
        )
        .orderBy("distance", "ASC")
        .setParameters({
          // stringify GeoJSON
          origin: JSON.stringify(origin),
          range: radius * 1000, //KM conversion
        })
        .getRawMany();
      return locations;
    } catch (error) {
      return getDataError(false, ERROR_UNKNOW, error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} userLocation`;
  }

  remove(id: number) {
    return `This action removes a #${id} userLocation`;
  }
}
