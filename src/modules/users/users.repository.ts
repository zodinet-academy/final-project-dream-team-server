import { createQueryBuilder, EntityRepository, Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { IUserRepository } from "./interfaces/user-repository.interface";

@EntityRepository(UserEntity)
export class UsersRepository
  extends Repository<UserEntity>
  implements IUserRepository {
  getUserByFullName(fullname: string): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }

  getById(id: number): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<UserEntity[]> {
    throw new Error("Method not implemented.");
  }
}
