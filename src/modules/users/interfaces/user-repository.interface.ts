import { CreateUserDto } from "../dto/create-user.dto";
import { UserEntity } from "../entities/user.entity";

export interface IUserRepository {
  getUserByFullName(fullName: string): Promise<UserEntity>;
  signUp(signUpDto: CreateUserDto): Promise<UserEntity>;
}
