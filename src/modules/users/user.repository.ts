import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entities/user.entity";
import { IUserRepository } from "./interfaces/user-repository.interface";
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>
  ) {}
  findByCondition(condition: any): Promise<UserEntity> {
    console.log(condition);
    throw new Error("Method not implemented.");
  }
  create(data: UserEntity): Promise<UserEntity> {
    console.log(data);

    throw new Error("Method not implemented.");
  }
  getUserByFullName(fullname: string): Promise<UserEntity> {
    console.log(fullname);
    throw new Error("Method not implemented.");
  }
  signUp(signUpDto: CreateUserDto): Promise<UserEntity> {
    console.log(signUpDto);
    throw new Error("Method not implemented.");
  }
  update(id: number, data: UserEntity): Promise<UserEntity> {
    console.log(id, data);
    throw new Error("Method not implemented.");
  }
  getById(id: number): Promise<UserEntity> {
    console.log(id);
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<UserEntity[]> {
    throw new Error("Method not implemented.");
  }
  delete(id: number): Promise<void> {
    console.log(id);
    throw new Error("Method not implemented.");
  }
}
