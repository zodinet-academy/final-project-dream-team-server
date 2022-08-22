import { AutoMap } from "@automapper/classes";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
} from "typeorm";

import { DefaultEntity } from "../../../common/entity";
import { IUserFriendsEntity } from "../interfaces";
import { UserEntity } from "../../users/entities/user.entity";

@Entity({ name: "user_friends", synchronize: true })
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

  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: "friend_id",
    referencedColumnName: "id",
  })
  infoFriend: UserEntity;
}
