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

  async getProfileMatching() {
    try {
      const query = this.createQueryBuilder("u")
        .select([
          `f.name AS "friendName"`,
          `u.is_friend AS "isFriend"`,
          `u.from_user_id AS "fromUserId"`,
          `u.to_user_id AS "toUserId"`,
          `u.is_friend AS "isFriend"`,
        ])
        .leftJoin("u.friend", "f")
        .where(`u.is_friend = false`);

      const result = await query.getRawMany();
      return result;
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }
}
