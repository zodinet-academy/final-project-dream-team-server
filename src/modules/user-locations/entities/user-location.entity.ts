import { AutoMap } from "@automapper/classes";
import { IsNotEmpty } from "class-validator";
import { Point } from "geojson";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
} from "typeorm";
import { DefaultEntity } from "../../../common/entity";
import { UserEntity } from "../../users/entities/user.entity";
import { IUserLocationEntity } from "../interfaces/user-location-entity.interface";

@Entity({ name: "user_locations", synchronize: true }) // bat buoc co, false: migration bo qua,
export class UserLocationEntity
  extends DefaultEntity
  implements IUserLocationEntity {
  @Column({ name: "user_id", type: "varchar", nullable: false })
  @IsNotEmpty()
  userId: string;

  @Column({ type: "double precision", default: 0 })
  @IsNotEmpty()
  @AutoMap()
  latitude: number;

  @Column({ type: "double precision", default: 0 })
  @IsNotEmpty()
  @AutoMap()
  longtitude: number;

  @OneToOne(() => UserEntity, (entity) => entity.id)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  userEntity: UserEntity;

  @Index({ spatial: true })
  @Column({
    type: "geography",
    spatialFeatureType: "Point",
    srid: 4326,
    nullable: true,
  })
  location: Point;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  @AutoMap()
  updatedAt: Date;
}
