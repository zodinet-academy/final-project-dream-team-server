import { EntityRepository, Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { IUserRepository } from "./interfaces/user-repository.interface";

@EntityRepository(UserEntity)
export class UsersRepository
  extends Repository<UserEntity>
  implements IUserRepository {
  async getListFriends(listFriendsId: string[]): Promise<UserEntity[]> {
    const query = this.createQueryBuilder("users").where(
      "users.id IN (:...listId)",
      {
        listId: listFriendsId,
      }
    );
    const result = await query.getMany();

    return result;
  }
  getUserByFullName(fullname: string): Promise<UserEntity> {
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
