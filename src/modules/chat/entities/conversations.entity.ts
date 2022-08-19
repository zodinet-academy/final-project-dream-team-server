import { AutoMap } from "@automapper/classes";
import { IsNotEmpty, IsUUID } from "class-validator";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { IConversationsEntity } from "../interfaces";
import { DefaultEntity } from "../../../common/entity";
import { UserEntity } from "../../users/entities/user.entity";
import { MessageEntity } from "./messages.entity";

@Entity({ name: "conversations", synchronize: false })
export class ConversationEntity
  extends DefaultEntity
  implements IConversationsEntity {
  @Column({ name: "user_id", type: "uuid" })
  @IsNotEmpty()
  @IsUUID()
  @AutoMap()
  userId: string;

  @Column({ name: "friend_id", type: "uuid" })
  @IsNotEmpty()
  @IsUUID()
  @AutoMap()
  friendId: string;

  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: "friend_id",
    referencedColumnName: "id",
  })
  infoFriend: UserEntity;

  @OneToMany(() => MessageEntity, (messages) => messages.conversation)
  messages: MessageEntity[];
}
