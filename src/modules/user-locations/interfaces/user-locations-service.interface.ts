import { CreateUserLocationDto } from "../dto/create-user-location.dto";
import { UserLocationEntity } from "../entities/user-location.entity";
import { ResponseDto } from "./../../../common/response.dto";
export interface IUserLocationsService {
  createOrUpdate(
    userId: string,
    createUserLocationDto: CreateUserLocationDto
  ): Promise<ResponseDto<UserLocationEntity | string>>;
}
