import { UserBlockEntity } from "./../../user-blocks/entities/user-block.entity";
import { AutoMap } from "@automapper/classes";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { DefaultEntity } from "../../../common/entity";
import {
  AlcoholEnum,
  EducationEnum,
  GenderEnum,
  MaritalStatusEnum,
  ReligionEnum,
} from "../../../constants/enum";
import { PurposeSettingEntity } from "./../../purpose-settings/entities/purpose-setting.entity";
import { IUserEntity } from "./../interfaces/user-entity.interface";
@Entity({ name: "users", synchronize: true }) // bat buoc co, false: migration bo qua,
export class UserEntity extends DefaultEntity implements IUserEntity {
  @Column({ type: "varchar", nullable: true })
  @AutoMap()
  avatar: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  @IsNotEmpty()
  @AutoMap()
  name: string;

  @Column({ type: "varchar", length: 100, unique: true, nullable: true })
  @IsNotEmpty()
  @AutoMap()
  email: string;

  @Column({ type: "varchar", length: 50, unique: true, nullable: true })
  @IsNotEmpty()
  @AutoMap()
  phone: string;

  @Column({
    nullable: true,
  })
  @IsNotEmpty()
  @AutoMap()
  birthday: Date;

  @Column({ default: GenderEnum.OTHER, type: "varchar", length: 10 })
  @IsEnum(GenderEnum)
  @AutoMap()
  gender: GenderEnum;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @AutoMap()
  description: string;

  @Column({ type: "bigint", default: 0, nullable: true })
  @IsNotEmpty()
  @AutoMap()
  children: number;

  @Column({ type: "varchar", length: 15, nullable: true })
  @IsEnum(AlcoholEnum)
  @AutoMap()
  alcohol: AlcoholEnum;

  @Column({ type: "varchar", length: 15, nullable: true })
  @IsEnum(ReligionEnum)
  @AutoMap()
  religion: ReligionEnum;

  @Column({ type: "bigint", default: 0 })
  @AutoMap()
  height: number;

  @Column({ name: "marital_status", type: "varchar", nullable: true })
  @IsEnum(MaritalStatusEnum)
  @AutoMap()
  maritalStatus: MaritalStatusEnum;

  @Column({ type: "varchar", length: 15, nullable: true })
  @IsEnum(EducationEnum)
  @AutoMap()
  education: EducationEnum;

  @Column({ name: "is_block", type: "boolean", default: false })
  @IsNotEmpty()
  @AutoMap()
  isBlock: boolean;

  @Column({ name: "is_verify", type: "boolean", default: false })
  @IsNotEmpty()
  @AutoMap()
  isVerify: boolean;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  @AutoMap()
  updatedAt: Date;

  @Column({ name: "purpose_id", type: "varchar", nullable: true })
  @IsNotEmpty()
  @AutoMap()
  purposeId: string;

  @ManyToOne(() => PurposeSettingEntity, (entity) => entity.id)
  @JoinColumn({
    name: "purpose_id",
    referencedColumnName: "id",
  })
  purposeSetting: PurposeSettingEntity;

  @OneToMany(() => UserBlockEntity, (entity) => entity.user)
  blockedUsers: UserBlockEntity[];
}
