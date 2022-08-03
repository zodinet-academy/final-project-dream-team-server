import { CommonRepository } from "src/common/repository";
import { UserEntity } from "../entities/user.entity";

export interface IUserRepository extends CommonRepository<UserEntity> {
  getUserByFullName(fullName: string): Promise<UserEntity>;
  findByCondition(condition: any): Promise<UserEntity>;
}
