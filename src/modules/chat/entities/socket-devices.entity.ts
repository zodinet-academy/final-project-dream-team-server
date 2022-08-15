import { AutoMap } from "@automapper/classes";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { ISocketDevicesEntity } from "../interfaces";
import { DefaultEntity } from "../../../common/entity";

@Entity({ name: "socket_devices", synchronize: true }) // bat buoc co, false: migration bo qua,
export class SocketDeviceEntity
  extends DefaultEntity
  implements ISocketDevicesEntity {
  @PrimaryColumn()
  @Generated("uuid")
  id: string;

  @Column({ type: "varchar", length: 150 })
  @IsNotEmpty()
  @IsUUID()
  @AutoMap()
  user_id: string;

  @Column({ type: "varchar", length: 150 })
  @IsNotEmpty()
  @IsUUID()
  @AutoMap()
  conversation_id: string;

  @Column({ type: "varchar", length: 150 })
  @IsNotEmpty()
  @IsString()
  @AutoMap()
  socket_id: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  @AutoMap()
  updatedAt: Date;
}
