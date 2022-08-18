import { Point } from "geojson";
import { Injectable } from "@nestjs/common";
import { responseData } from "../../common/utils";

import {
  ERROR_DATA_NOT_FOUND,
  ERROR_UNKNOWN,
} from "./../../constants/code-response.constant";
import { IUserLocationsService } from "./interfaces";

import { SettingEntity } from "../settings/entities/setting.entity";
import { UserLocationEntity } from "./entities/user-location.entity";

import { ResponseDto } from "../../common/response.dto";
import { CreateUserLocationDto } from "./dto/create-user-location.dto";

import { SettingsService } from "../settings/settings.service";
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

  async findAllByDistance(userId: string) {
    try {
      const findData = await this.userLocationsRepository.findOne({
        userId: userId,
      });
      if (!findData) return responseData(null, null, ERROR_DATA_NOT_FOUND);

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
