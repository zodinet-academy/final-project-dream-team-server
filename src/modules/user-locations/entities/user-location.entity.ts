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

@Entity({ name: "user_locations", synchronize: false }) // bat buoc co, false: migration bo qua,
export class UserLocationEntity
  extends DefaultEntity
  implements IUserLocationEntity {
  @Column({ type: "varchar", nullable: false })
  @IsNotEmpty()
  userId: string;

  @Column({ type: "double precision", default: 0 })
  @IsNotEmpty()
  @AutoMap()
  lat: number;

  @Column({ type: "double precision", default: 0 })
  @IsNotEmpty()
  @AutoMap()
  long: number;

  @UpdateDateColumn({ name: "updatedAt", type: "timestamp" })
  @AutoMap()
  updatedAt: Date;

  @OneToOne(() => UserEntity, (entity) => entity.id)
  @JoinColumn({
    name: "userId",
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
}
