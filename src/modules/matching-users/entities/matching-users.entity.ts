import { IsNotEmpty } from "class-validator";
import { Column, Entity } from "typeorm";
import { DefaultEntity } from "../../../common/entity";
import { IMatchingUsersEntity } from "../interfaces";

@Entity({ name: "matching_users", synchronize: false })
export class MatchingUsersEntity
  extends DefaultEntity
  implements IMatchingUsersEntity {
  @Column({ type: "varchar", nullable: false })
  @IsNotEmpty()
  userId: string;

  @Column({ type: "varchar", nullable: false })
  @IsNotEmpty()
  friendId: string;
}
