import { EntityRepository, Repository } from "typeorm";
import { IResponsePagination } from "../../common/interfaces/page-meta-dto-parameters.interface";
import { Order } from "../../constants/enum";
import { UserEntity } from "./entities/user.entity";
import { IUserRepository } from "./interfaces/user-repository.interface";

@EntityRepository(UserEntity)
export class UsersRepository
  extends Repository<UserEntity>
  implements IUserRepository {
  getUserByFullName(): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }

  getById(id: number): Promise<UserEntity> {
    console.log(id);
    throw new Error("Method not implemented.");
  }
  async getAll(
    order: Order,
    page: number,
    limit: number
  ): Promise<IResponsePagination> {
    try {
      const query = this.createQueryBuilder("users")
        .orderBy(`users.createdAt`, order)
        .take(limit)
        .skip(page * limit);

      const results = await query.getManyAndCount();

      return {
        list: results[0],
        total: results[1],
        limit: limit,
        page: page,
      };
      return;
    } catch (error) {
      throw new Error("Method not implemented.");
    }
  }
}
