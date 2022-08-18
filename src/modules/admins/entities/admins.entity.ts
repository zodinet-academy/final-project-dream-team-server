import { IsNotEmpty } from "class-validator";
import { AutoMap } from "@automapper/classes";
import { Column, Entity, UpdateDateColumn } from "typeorm";

import { IAdminEntity } from "../interfaces";
import { DefaultEntity } from "../../../common/entity";

@Entity({ name: "admins", synchronize: true }) // bat buoc co, false: migration bo qua,
export class AdminEntity extends DefaultEntity implements IAdminEntity {
  @Column({ type: "varchar", length: 150 })
  @IsNotEmpty()
  @AutoMap()
  name: string;

  @Column({ type: "varchar", length: 150 })
  @IsNotEmpty()
  email: string;

  @Column({ type: "varchar" })
  @IsNotEmpty()
  @AutoMap()
  avatar: string;

  @Column({ type: "varchar", length: 150 })
  @IsNotEmpty()
  @AutoMap()
  username: string;

  @Column({ type: "varchar" })
  @IsNotEmpty()
  password: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  @AutoMap()
  updatedAt: Date;
}
