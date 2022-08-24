import { AutoMap } from "@automapper/classes";
import { IsNotEmpty } from "class-validator";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm";
import { DefaultEntity } from "../../../common/entity";
import { UserEntity } from "../../users/entities/user.entity";
import { IUserImageEntity } from "../interfaces";

@Entity({ name: "user_images", synchronize: true }) // bat buoc co, false: migration bo qua,
export class UserImageEntity extends DefaultEntity implements IUserImageEntity {
  @Column({ name: "user_id", type: "uuid", nullable: false })
  @IsNotEmpty()
  @AutoMap()
  userId: string;

  @Column({ name: "cloud_id", type: "varchar" })
  @IsNotEmpty()
  @AutoMap()
  cloudId: string;

  @Column({ name: "is_favorite", type: "boolean", default: false })
  @IsNotEmpty()
  @AutoMap()
  isFavorite: boolean;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  @AutoMap()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (entity) => entity.userImages)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  user: UserEntity;
}
