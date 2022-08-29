import { AutoMap } from "@automapper/classes";
import { IsNotEmpty, IsUUID } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { DefaultEntity } from "../../../common/entity";
import { UserEntity } from "../../users/entities/user.entity";
import { IUserBlockEntity } from "./../interfaces/user-block-entity.interface";

@Entity({ name: "user_blocks", synchronize: false })
export class UserBlockEntity extends DefaultEntity implements IUserBlockEntity {
  @Column({ name: "user_id", type: "uuid", nullable: false })
  @IsNotEmpty()
  @AutoMap()
  userId: string;

  @Column({ name: "blocked_user_id", type: "uuid", nullable: false })
  @IsNotEmpty()
  @IsUUID()
  @AutoMap()
  blockedUserId: string;

  @ManyToOne(() => UserEntity, (entity) => entity.id)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  user: UserEntity;
}
