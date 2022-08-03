import { UserEntity } from "../entities/user.entity";

export interface IUserService {
  findAll(): Promise<Array<UserEntity>>;
  getUserByPhone(phone: string): Promise<UserEntity>;
}
