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
    const userFriends = await this.createQueryBuilder("UF")
      .leftJoinAndSelect("UF.infoFriend", "infoFriend")
      .andWhere(`UF.user_id = '${userId}' OR UF.friend_id = '${userId}'`)
      .select([
        `UF.friend_id as id, infoFriend.name as name, infoFriend.avatar as avatar`,
      ])
      .getRawMany<IInfoFriendUser>();

    return userFriends;
  }

  async getFriendByFriendIdAndFriendId(
    userId: string,
    friendId: string
  ): Promise<IInfoFriend> {
    const infoFriend = await this.createQueryBuilder("UF")
      .leftJoinAndSelect("UF.infoFriend", "infoFriend")
      .andWhere(`UF.user_id = '${userId}' AND UF.friend_id = '${friendId}'`)
      .select([
        `UF.friend_id as id, infoFriend.name as name, infoFriend.avatar as avatar, UF.created_at as "createAt"`,
      ])
      .getRawOne<IInfoFriend>();

    return infoFriend;
  }
}
