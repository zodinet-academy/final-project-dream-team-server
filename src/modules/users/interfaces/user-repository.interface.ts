import { CommonRepository } from "../../../common/repository";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserEntity } from "../entities/user.entity";

export interface IUserRepository extends CommonRepository<UserEntity> {
  getUserByFullName(fullName: string): Promise<UserEntity>;
  signUp(signUpDto: CreateUserDto): Promise<UserEntity>;
  findByCondition(condition: any): Promise<UserEntity>;
}
