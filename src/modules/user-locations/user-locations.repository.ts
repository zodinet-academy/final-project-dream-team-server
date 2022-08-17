import { IOrigin } from "./interfaces/user-location-entity.interface";
import { EntityRepository, getManager, Repository } from "typeorm";
import { UserLocationEntity } from "./entities/user-location.entity";
import { IFriendNearUser } from "./interfaces";

@EntityRepository(UserLocationEntity)
export class UserLocationsRepository extends Repository<UserLocationEntity> {
  async getFriendNearUser(
    radius: number,
    origin: IOrigin
  ): Promise<IFriendNearUser[]> {
    try {
      const a = this.createQueryBuilder("ul")
        .select([
          `ul.userId AS "friendId"`,
          "ul.latitude AS latitude",
          "ul.longtitude AS longtitude",
          `users.name AS "friendName"`,
          `users.name AS "friendName"`,

          "ST_Distance(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location)))/1000 AS distance",
        ])
        .leftJoin("ul.userEntity", "users")
        .andWhere(
          "ST_DWithin(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location)) ,:range)"
        )
        .orderBy("distance", "ASC")
        .setParameters({
          // stringify GeoJSON
          origin: JSON.stringify(origin),
          range: radius * 1000, //KM conversion
        });

      // const query = this.createQueryBuilder("user_locations")
      //   .select(`DISTINCT ON (u."friendId") u.*`)
      //   .from((subQuery) => {
      //     return subQuery
      //       .select([
      //         // `ul.userId AS "friendId"`,
      //         // "ul.latitude AS latitude",
      //         // "ul.longtitude AS longtitude",
      //         "ul.*",
      //         "ST_Distance(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location)))/1000 AS distance",
      //       ])
      //       .from("user_locations", "ul")
      //       .where(
      //         "ST_DWithin(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location)) ,:range)"
      //       )
      //       .orderBy("distance", "ASC")
      //       .setParameters({
      //         // stringify GeoJSON
      //         origin: JSON.stringify(origin),
      //         range: radius * 1000, //KM conversion
      //       });
      //   }, "u")
      //   .leftJoinAndSelect("users", "users")
      //   .where("u.distance > 0")
      //   .leftJoinAndSelect("users", "users");
      const result = await a.getRawMany<IFriendNearUser>();
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
