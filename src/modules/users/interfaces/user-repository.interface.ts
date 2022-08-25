import { CommonRepository } from "../../../common/repository";
import { UserEntity } from "../entities/user.entity";

export interface IUserRepository extends CommonRepository<UserEntity> {
  getUserByFullName(fullName: string): Promise<UserEntity>;
}
