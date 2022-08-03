import { EntityRepository, Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { IUserRepository } from "./interfaces/user-repository.interface";

@EntityRepository(UserEntity)
export class UsersRepository
  extends Repository<UserEntity>
  implements IUserRepository {
  findByCondition(condition: any): Promise<UserEntity> {
    console.log(condition);
    throw new Error("Method not implemented.");
  }

  getUserByFullName(fullname: string): Promise<UserEntity> {
    console.log(fullname);
    throw new Error("Method not implemented.");
  }

  getById(id: number): Promise<UserEntity> {
    console.log(id);
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<UserEntity[]> {
    throw new Error("Method not implemented.");
  }
}
