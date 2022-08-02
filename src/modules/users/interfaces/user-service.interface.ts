import { ResponseDto } from "../../../common/response.dto";
import { UserEntity } from "../entities/user.entity";

export interface IUserService {
  findAll(): Promise<Array<UserEntity>>;
  findById(id: string): Promise<ResponseDto<UserEntity>>;
}
