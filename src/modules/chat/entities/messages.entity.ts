import { AutoMap } from "@automapper/classes";
import { IsNotEmpty, IsString, IsUrl, IsUUID } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
} from "typeorm";

import { IMessageEntity } from "../interfaces";
import { DefaultEntity } from "../../../common/entity";

@Entity({ name: "messages", synchronize: false }) // bat buoc co, false: migration bo qua,
export class MessageEntity extends DefaultEntity implements IMessageEntity {
  @PrimaryColumn()
  @Generated("uuid")
  id: string;

  @Column({ type: "varchar", length: 150 })
  @IsNotEmpty()
  @IsUUID()
  @AutoMap()
  sender_id: string;

  @Column({ type: "varchar", length: 150 })
  @IsNotEmpty()
  @IsUUID()
  @AutoMap()
  conversation_id: string;

  @Column({ type: "varchar", length: 150 })
  @IsNotEmpty()
  @IsString()
  @AutoMap()
  content: string;

  @Column({ type: "varchar", length: 150 })
  @IsNotEmpty()
  @IsUrl()
  @AutoMap()
  image: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  @AutoMap()
  createdAt: Date;
}
