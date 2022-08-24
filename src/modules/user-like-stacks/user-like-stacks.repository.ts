import { EntityRepository, Repository } from "typeorm";
import { UserLikeStackEntity } from "./entities/user-like-stack.entity";

@EntityRepository(UserLikeStackEntity)
export class UserLikeStacksRepository extends Repository<UserLikeStackEntity> {
  async getMatchingFriends(id: string) {
    try {
      const query = await this.createQueryBuilder("u")
        .select([`u.id`, `friend.id`, `friend.avatar`])
        .leftJoin("u.friend", "friend")
        .where(`u.fromUserId = '${id}'`)
        .andWhere(`u.isFriend = true`)
        .orderBy(`u.updatedAt`, "ASC")
        .getMany();

      return query;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
