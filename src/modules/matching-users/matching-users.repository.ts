import { Brackets, EntityRepository, Repository } from "typeorm";
import { MatchingUsersEntity } from "./entities/matching-users.entity";
import { IMatchingUsersRepository } from "./interfaces";

@EntityRepository(MatchingUsersEntity)
export class MatchingUsersRepository
  extends Repository<MatchingUsersEntity>
  implements IMatchingUsersRepository {
  async getListFriends(id: string): Promise<string[]> {
    try {
      const query = this.createQueryBuilder("matchingUsers").andWhere(
        new Brackets((qb) => {
          qb.where(`matchingUsers.friendId = '${id}'`).orWhere(
            `matchingUsers.userId ='${id}'`
          );
        })
      );
      const result = await query.getMany();
      const listFriendsId = result.map((item) => {
        if (item.friendId !== id) return item.friendId;
        if (item.userId !== id) return item.userId;
      });

      return listFriendsId;
    } catch (error) {
      console.log(error);
      throw new Error("ERROR WITH MATCHING USERS REPOSITORY");
    }
  }
  getById(id: number): Promise<MatchingUsersEntity> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<MatchingUsersEntity[]> {
    throw new Error("Method not implemented.");
  }
}
