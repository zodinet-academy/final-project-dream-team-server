import { IUserEntity } from "./../interfaces/user-entity.interface";
import { AutoMap } from "@automapper/classes";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import {
  Column,
  DeleteDateColumn,
  Entity,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { DefaultEntity } from "../../../common/entity";
import { GenderType } from "../../../constants";
@Entity({ name: "users", synchronize: true }) // bat buoc co, false: migration bo qua,
@Unique(["phone", "email"])
export class UserEntity extends DefaultEntity implements IUserEntity {
  @Column({ type: "varchar", nullable: true })
  @AutoMap()
  avatar: string;

  @Column({ type: "varchar", length: 150 })
  @AutoMap()
  @IsNotEmpty()
  nickname: string;

  @Column({ type: "varchar", length: 150 })
  @AutoMap()
  @IsNotEmpty()
  fullname: string;

  @Column({ type: "varchar", length: 100 })
  @AutoMap()
  @IsNotEmpty()
  email: string;

  @Column({ type: "varchar", length: 50 })
  @AutoMap()
  @IsNotEmpty()
  phone: string;

  @Column({ type: "varchar", length: 10 })
  @AutoMap()
  @IsEnum(GenderType)
  gender: GenderType;

  @Column({ type: "boolean", default: false })
  @IsNotEmpty()
  is_block: boolean;

  @Column({ type: "bigint", default: 0 })
  @IsNotEmpty()
  balance: number;

  @Column({ type: "float", default: 0 })
  @AutoMap()
  @IsNotEmpty()
  lat: number;

  @Column({ type: "float", default: 0 })
  @AutoMap()
  @IsNotEmpty()
  lng: number;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp" })
  deleted_at: Date;
}
