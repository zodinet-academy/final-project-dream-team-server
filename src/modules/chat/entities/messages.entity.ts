import { AutoMap } from "@automapper/classes";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { IsNotEmpty, IsString, IsUrl, IsUUID } from "class-validator";

import { IMessageEntity } from "../interfaces";
import { DefaultEntity } from "../../../common/entity";
import { ConversationEntity } from "./conversations.entity";
import { UserEntity } from "./../../users/entities/user.entity";

@Entity({ name: "messages", synchronize: false })
export class MessageEntity extends DefaultEntity implements IMessageEntity {
  @Column({ name: "sender_id", type: "uuid" })
  @IsNotEmpty()
  @IsUUID()
  @AutoMap()
  senderId: string;

  @Column({ name: "conversation_id", type: "uuid" })
  @IsNotEmpty()
  @IsUUID()
  @AutoMap()
  conversationId: string;

  @Column({ type: "varchar", length: 150 })
  @IsNotEmpty()
  @IsString()
  @AutoMap()
  content: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  @IsNotEmpty()
  @IsUrl()
  @AutoMap()
  image: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: "sender_id",
    referencedColumnName: "id",
  })
  user: UserEntity;

  @ManyToOne(() => ConversationEntity, (conversation) => conversation.messages)
  @JoinColumn({
    name: "conversation_id",
    referencedColumnName: "id",
  })
  conversation: ConversationEntity;
}
