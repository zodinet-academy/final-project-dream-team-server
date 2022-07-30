import { IUserService } from "./interfaces/user-service.interface";
import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService implements IUserService {
  findAll(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
}
