import { AutoMap } from "@automapper/classes";
import { Column, Entity, UpdateDateColumn } from "typeorm";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

import { ISocketDevicesEntity } from "../interfaces";
import { DefaultEntity } from "../../../common/entity";

@Entity({ name: "socket_devices", synchronize: true })
export class SocketDeviceEntity
  extends DefaultEntity
  implements ISocketDevicesEntity {
  @Column({ name: "user_id", type: "uuid", unique: true })
  @IsNotEmpty()
  @IsUUID()
  @AutoMap()
  userId: string;

  @Column({ name: "socket_id" })
  @IsNotEmpty()
  @IsString()
  @AutoMap()
  socketId: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  @AutoMap()
  updatedAt: Date;
}
