import { IsEnum, IsNotEmpty } from "class-validator";
import {
  Column,
  DeleteDateColumn,
  Entity,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { DefaultEntity } from "../../../common/entity";
import { GenderType } from "../../../constants";
import { IUserEntity } from "./../interfaces/user-entity.interface";
@Entity({ name: "users", synchronize: true }) // bat buoc co, false: migration bo qua,
@Unique(["phone", "email"])
export class UserEntity extends DefaultEntity implements IUserEntity {
  @Column({ type: "varchar", nullable: true })
  avatar: string;

  @Column({ type: "varchar", length: 150 })
  @IsNotEmpty()
  nickname: string;

  @Column({ type: "varchar", length: 150 })
  @IsNotEmpty()
  fullname: string;

  @Column({ type: "varchar", length: 100 })
  @IsNotEmpty()
  email: string;

  @Column({ type: "varchar", length: 50 })
  @IsNotEmpty()
  phone: string;

  @Column({ type: "varchar", length: 10 })
  @IsEnum(GenderType)
  gender: GenderType;

  @Column({ type: "boolean", default: false })
  @IsNotEmpty()
  is_block: boolean;

  @Column({ type: "bigint", default: 0 })
  @IsNotEmpty()
  balance: number;

  @Column({ type: "float", default: 0 })
  @IsNotEmpty()
  lat: number;

  @Column({ type: "float", default: 0 })
  @IsNotEmpty()
  lng: number;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp" })
  deleted_at: Date;
}
