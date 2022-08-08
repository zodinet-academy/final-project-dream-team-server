import { Column, Entity, UpdateDateColumn } from "typeorm";
import { DefaultEntity } from "../../../common/entity";
import { AutoMap } from "@automapper/classes";
import { IsNotEmpty } from "class-validator";
import { ISettingEntity } from "../interfaces";

@Entity({ name: "settings", synchronize: false }) // bat buoc co, false: migration bo qua,
export class SettingEntity extends DefaultEntity implements ISettingEntity {
  @Column({ type: "integer", default: 1 })
  @IsNotEmpty()
  @AutoMap()
  radius: number;

  @UpdateDateColumn({ name: "updatedAt", type: "timestamp" })
  @AutoMap()
  updatedAt: Date;
}
