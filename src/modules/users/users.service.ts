import { IUserService } from "./interfaces/user-service.interface";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "./entities/user.entity";
import { UserRepository } from "./user.repository";

@Injectable()
export class UsersService implements IUserService {
  constructor(private userRepository: UserRepository) {}

  findAll(): Promise<UserEntity[]> {
    throw new Error("Method not implemented.");
  }
  async getUserByPhone(phone: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ phone: phone });
    return user;
  }
}
