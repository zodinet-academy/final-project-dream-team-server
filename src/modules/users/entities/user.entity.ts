import { AutoMap } from "@automapper/classes";
import { IsEnum, IsNotEmpty } from "class-validator";
import {
  Column,
  DeleteDateColumn,
  Entity,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { DefaultEntity } from "../../../common/entity";
import { GenderEnum } from "../../../constants/enum";
import { IUserEntity } from "./../interfaces/user-entity.interface";
@Entity({ name: "users", synchronize: true }) // bat buoc co, false: migration bo qua,
@Unique(["phone", "email"])
export class UserEntity extends DefaultEntity implements IUserEntity {
  @Column({ type: "varchar", nullable: true })
  @AutoMap()
  avatar: string;

  @Column({ type: "varchar", length: 150 })
  @IsNotEmpty()
  @AutoMap()
  nickname: string;

  @Column({ type: "varchar", length: 150 })
  @IsNotEmpty()
  @AutoMap()
  fullname: string;

  @Column({ type: "varchar", length: 100 })
  @IsNotEmpty()
  @AutoMap()
  email: string;

  @Column({ type: "varchar", length: 50 })
  @IsNotEmpty()
  @AutoMap()
  phone: string;

  @Column({ type: "varchar", length: 10 })
  @IsEnum(GenderEnum)
  @AutoMap()
  gender: GenderEnum;

  @Column({ type: "boolean", default: false })
  @IsNotEmpty()
  @AutoMap()
  isBlock: boolean;

  @Column({ type: "bigint", default: 0 })
  @IsNotEmpty()
  @AutoMap()
  balance: number;

  @UpdateDateColumn({ name: "updatedAt", type: "timestamp" })
  @AutoMap()
  updatedAt: Date;

  @DeleteDateColumn({ name: "deletedAt", type: "timestamp" })
  @AutoMap()
  deletedAt: Date;
}
