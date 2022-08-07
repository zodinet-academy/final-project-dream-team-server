import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
} from "typeorm";

@Entity("conversations")
export class ConversationEntity {
  @PrimaryColumn()
  @Generated("uuid")
  id: string;

  @Column({
    length: 255,
    nullable: false,
  })
  user_id: string;

  @Column({
    length: 255,
    nullable: false,
  })
  friend_id: string;

  @Column({
    length: 255,
    nullable: false,
  })
  socket_id: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}
