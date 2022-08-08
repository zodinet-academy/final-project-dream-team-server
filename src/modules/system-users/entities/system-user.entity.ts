import { AutoMap } from "@automapper/classes";
import { IsEnum, IsNotEmpty } from "class-validator";
import { Column, DeleteDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { DefaultEntity } from "../../../common/entity";
import { GenderEnum } from "../../../constants";
import { ISystemUserEntity } from "../interfaces/system-user-entity.interface";

@Entity({ name: "system_users", synchronize: true }) // bat buoc co, false: migration bo qua,
export class SystemUserEntity
  extends DefaultEntity
  implements ISystemUserEntity {
  @Column({ type: "varchar", length: 150 })
  @IsNotEmpty()
  @AutoMap()
  username: string;

  @Column({ type: "varchar" })
  @IsNotEmpty()
  password: string;

  @Column({ type: "varchar", length: 150 })
  @IsNotEmpty()
  @AutoMap()
  email: string;

  @Column({ type: "varchar" })
  @IsNotEmpty()
  @AutoMap()
  phone: string;

  @Column({ type: "varchar", length: 10 })
  @IsEnum(GenderEnum)
  @AutoMap()
  gender: GenderEnum;

  @UpdateDateColumn({ name: "updatedAt", type: "timestamp" })
  @AutoMap()
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleteddAt", type: "timestamp" })
  @AutoMap()
  deleteddAt: Date;
}
