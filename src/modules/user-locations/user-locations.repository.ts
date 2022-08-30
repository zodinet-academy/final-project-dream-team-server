import { EntityRepository, Repository } from "typeorm";
import { UserLocationEntity } from "./entities/user-location.entity";
import { IFriendNearUser, IUserLocationsRepository } from "./interfaces";
import { IOrigin } from "./interfaces/user-location-entity.interface";

@EntityRepository(UserLocationEntity)
export class UserLocationsRepository
  extends Repository<UserLocationEntity>
  implements IUserLocationsRepository {
  async getFriendNearUser(
    radius: number,
    origin: IOrigin,
    blockedUsers: string[],
    likedUsers: string[],
    friends: string[]
  ): Promise<IFriendNearUser[]> {
    try {
      // const a = await this.createQueryBuilder("ul")
      //   .select([
      //     `ul.userId AS "id"`,
      //     "ul.latitude AS latitude",
      //     "ul.longtitude AS longtitude",
      //     `users.name AS "name"`,
      //     `users.birthday AS "birthday"`,
      //     `users.avatar AS "avatar"`,
      //     "ST_Distance(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location))) AS distance",
      //   ])
      //   .leftJoin("ul.userEntity", "users")
      //   .where(
      //     "ST_DWithin(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location)) ,:range)"
      //   )
      //   .orderBy("distance", "ASC")
      //   .setParameters({
      //     // stringify GeoJSON
      //     origin: JSON.stringify(origin),
      //     range: radius * 1000, //KM conversion
      //     blockedUsers: blockedUsers,
      //     likedUsers: likedUsers,
      //   })
      //   .getRawMany();
      // console.log(a);

      const query = this.createQueryBuilder("ul")
        .select([
          `ul.userId AS "id"`,
          "ul.latitude AS latitude",
          "ul.longtitude AS longtitude",
          `users.name AS "name"`,
          `users.birthday AS "birthday"`,
          `users.avatar AS "avatar"`,
          "ST_Distance(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location))) AS distance",
        ])
        // .from("user_locations", "ul")
        .leftJoin("ul.userEntity", "users")
        .where(
          "ST_DWithin(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location)) ,:range)"
        )
        .orderBy("distance", "ASC")
        .setParameters({
          // stringify GeoJSON
          origin: JSON.stringify(origin),
          range: radius * 1000, //KM conversion
          blockedUsers: blockedUsers,
          likedUsers: likedUsers,
          friends: friends,
        });

      if (blockedUsers.length)
        query.andWhere(`ul.userId NOT IN (:...blockedUsers)`);
      if (likedUsers.length)
        query.andWhere(`ul.userId NOT IN (:...likedUsers)`);
      if (friends.length) query.andWhere(`ul.userId NOT IN (:...friends)`);

      const result = await query.getRawMany<IFriendNearUser>();
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
