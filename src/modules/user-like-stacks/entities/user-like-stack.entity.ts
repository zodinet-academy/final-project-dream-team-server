import { IUserLikeStackEntity } from "./../interfaces/user-like-stack-entity.interface";
import { DefaultEntity } from "../../../common/entity";
import { IsNotEmpty } from "class-validator";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";
import { AutoMap } from "@automapper/classes";

@Entity({ name: "user_like_stacks", synchronize: true })
export class UserLikeStackEntity
  extends DefaultEntity
  implements IUserLikeStackEntity {
  @Column({ name: "from_user_id", type: "varchar", nullable: false })
  @IsNotEmpty()
  fromUserId: string;

  @Column({ name: "to_user_id", type: "varchar", nullable: false })
  @IsNotEmpty()
  toUserId: string;

  @Column({
    name: "is_friend",
    type: "boolean",
    nullable: false,
    default: false,
  })
  @IsNotEmpty()
  isFriend: boolean;

  @ManyToOne(() => UserEntity, (entity) => entity.id)
  @JoinColumn({
    name: "from_user_id",
    referencedColumnName: "id",
  })
  user: UserEntity;

  @ManyToOne(() => UserEntity, (entity) => entity.id)
  @JoinColumn({
    name: "to_user_id",
    referencedColumnName: "id",
  })
  friend: UserEntity;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  @AutoMap()
  updatedAt: Date;
}
