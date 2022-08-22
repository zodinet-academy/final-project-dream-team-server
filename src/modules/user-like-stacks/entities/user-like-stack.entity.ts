import { IUserLikeStackEntity } from "./../interfaces/user-like-stack-entity.interface";
import { DefaultEntity } from "../../../common/entity";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";

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

  @ManyToOne(() => UserEntity, (entity) => entity.id)
  @JoinColumn({
    name: "from_user_id",
    referencedColumnName: "id",
  })
  user: UserEntity;
}
