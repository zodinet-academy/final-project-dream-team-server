import { UserEntity } from "../entities/user.entity";

export interface IUserRepository {
  getUserByFullName(fullName: string): Promise<UserEntity>;
}
