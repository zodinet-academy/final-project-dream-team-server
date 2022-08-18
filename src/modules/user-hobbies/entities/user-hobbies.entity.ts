import { AutoMap } from "@automapper/classes";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, UpdateDateColumn } from "typeorm";
import { DefaultEntity } from "../../../common/entity";
import { IUserHobbyEntity } from "../interfaces";

@Entity({ name: "user_hobbies", synchronize: false })
export class UserHobbyEntity extends DefaultEntity implements IUserHobbyEntity {
  @Column({ name: "user_id", type: "varchar" })
  @IsNotEmpty()
  @AutoMap()
  userId: string;

  @Column({ type: "varchar" })
  @IsNotEmpty()
  @AutoMap()
  name: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  @AutoMap()
  updatedAt: Date;
}
