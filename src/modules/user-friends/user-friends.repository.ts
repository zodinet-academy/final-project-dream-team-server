import { EntityRepository, Repository } from "typeorm";

import {
  IUserFriendsRepository,
  IInfoFriendUser,
  IInfoFriend,
} from "./interfaces";
import { UserFriendsEntity } from "./entities/user-friends.entity";

@EntityRepository(UserFriendsEntity)
export class UserFriendsRepository
  extends Repository<UserFriendsEntity>
  implements IUserFriendsRepository {
  async getUserFriendsByUserId(userId: string): Promise<IInfoFriendUser[]> {
    const infoFriends = await this.createQueryBuilder("UF")
      .leftJoinAndSelect("UF.friend", "friend")
      .andWhere(`UF.user_id = '${userId}'`)
      .select([
        `UF.friend_id as id, friend.name as name, friend.avatar as avatar`,
      ])
      .getRawMany<IInfoFriendUser>();

    const infoUsers = await this.createQueryBuilder("UF")
      .leftJoinAndSelect("UF.user", "user")
      .andWhere(`UF.friend_id = '${userId}'`)
      .select([`UF.user_id as id, user.name as name, user.avatar as avatar`])
      .getRawMany<IInfoFriendUser>();

    return [...infoFriends, ...infoUsers];
  }

  async getFriendByFriendIdAndFriendId(
    userId: string,
    friendId: string
  ): Promise<IInfoFriend> {
    const infoFriend = await this.createQueryBuilder("UF")
      .leftJoinAndSelect("UF.friend", "friend")
      .andWhere(`UF.user_id = '${userId}' AND UF.friend_id = '${friendId}'`)
      .select([
        `UF.friend_id as id, friend.name as name, friend.avatar as avatar, UF.created_at as "createAt"`,
      ])
      .getRawOne<IInfoFriend>();

    if (!infoFriend) {
      const infoUser = await this.createQueryBuilder("UF")
        .leftJoinAndSelect("UF.user", "user")
        .andWhere(`UF.user_id = '${friendId}' AND UF.friend_id = '${userId}'`)
        .select([
          `UF.user_id as id, user.name as name, user.avatar as avatar, UF.created_at as "createAt"`,
        ])
        .getRawOne<IInfoFriend>();

      return infoUser;
    }

    return infoFriend;
  }
}
