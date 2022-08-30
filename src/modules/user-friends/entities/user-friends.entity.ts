import { AutoMap } from "@automapper/classes";
import { IsNotEmpty, IsUUID } from "class-validator";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm";

import { DefaultEntity } from "../../../common/entity";
import { IUserFriendsEntity } from "../interfaces";
import { UserEntity } from "../../users/entities/user.entity";

@Entity({ name: "user_friends", synchronize: false })
export class UserFriendsEntity
  extends DefaultEntity
  implements IUserFriendsEntity {
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

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  @AutoMap()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: "friend_id",
    referencedColumnName: "id",
  })
  friend: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  user: UserEntity;
}
