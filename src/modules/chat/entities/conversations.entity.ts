import { AutoMap } from "@automapper/classes";
import { IsNotEmpty, IsUUID } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
} from "typeorm";

import { IConversationsEntity } from "../interfaces";
import { DefaultEntity } from "../../../common/entity";

@Entity({ name: "conversations", synchronize: true }) // bat buoc co, false: migration bo qua,
export class ConversationEntity
  extends DefaultEntity
  implements IConversationsEntity {
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
  friend_id: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  @AutoMap()
  createdAt: Date;
}
