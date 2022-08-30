import { AutoMap } from "@automapper/classes";
import { IsNotEmpty } from "class-validator";
import {
  Entity,
  Column,
  OneToMany,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { DefaultEntity } from "../../../common/entity";
import { UserEntity } from "../../users/entities/user.entity";
import { IPurposeSettingsEntity } from "../interfaces";

@Entity({ name: "purpose_settings", synchronize: false }) // bat buoc co, false: migration bo qua,
export class PurposeSettingEntity
  extends DefaultEntity
  implements IPurposeSettingsEntity {
  @Column({ type: "varchar", length: 255 })
  @IsNotEmpty()
  @AutoMap()
  title: string;

  @Column({ type: "varchar", length: 255 })
  @IsNotEmpty()
  @AutoMap()
  description: string;

  @Column({ type: "varchar", nullable: true })
  @AutoMap()
  image: string;

  @OneToMany(() => UserEntity, (userEntity) => userEntity.purposeSetting)
  users: UserEntity[];

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  @AutoMap()
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp" })
  @AutoMap()
  deletedAt: Date;
}
