import { IUserService } from "./interfaces/user-service.interface";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UsersService implements IUserService {
  findAll(): Promise<UserEntity[]> {
    throw new Error("Method not implemented.");
  }
}
