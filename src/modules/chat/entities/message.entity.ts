import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("messages")
export class MessageEntity {
  @PrimaryColumn()
  @Generated("uuid")
  id: string;

  @Column({
    length: 255,
    nullable: false,
  })
  sender_id: string;

  @Column({
    length: 255,
    nullable: false,
  })
  conversation_id: string;

  @Column({
    length: 255,
    nullable: false,
  })
  content: string;

  @Column({
    length: 255,
    nullable: false,
  })
  image: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
