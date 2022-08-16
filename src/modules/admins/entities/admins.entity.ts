import { AutoMap } from "@automapper/classes";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, UpdateDateColumn } from "typeorm";
import { DefaultEntity } from "../../../common/entity";
import { IAdminEntity } from "../interfaces";

@Entity({ name: "admins", synchronize: false }) // bat buoc co, false: migration bo qua,
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
