import { SettingEntity } from "../../settings/entities/setting.entity";
import { CreateUserLocationDto } from "../dto/create-user-location.dto";
import { UserLocationEntity } from "../entities/user-location.entity";
import { ResponseDto } from "./../../../common/response.dto";
import { IFriendNearUser } from "./user-location-entity.interface";
export interface IUserLocationsService {
  createOrUpdate(
    userId: string,
    createUserLocationDto: CreateUserLocationDto
  ): Promise<ResponseDto<UserLocationEntity | string>>;
  getUserLocation(
    userId: string
  ): Promise<ResponseDto<string | UserLocationEntity>>;
  getFriendNearUser(
    userId: string
  ): Promise<ResponseDto<IFriendNearUser[] | string | SettingEntity>>;
}
