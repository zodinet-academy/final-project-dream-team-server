import { AutoMap } from "@automapper/classes";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
} from "typeorm";

import { ISocketDevicesEntity } from "../interfaces";
import { DefaultEntity } from "../../../common/entity";
import { UserEntity } from "../../users/entities/user.entity";

@Entity({ name: "socket_devices", synchronize: false })
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

  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  user: UserEntity;
}
