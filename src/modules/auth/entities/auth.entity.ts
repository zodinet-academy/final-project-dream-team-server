import { AutoMap } from "@automapper/classes";
import { IsNotEmpty } from "class-validator";
import { DefaultEntity } from "src/common/entity";
import { Column, Entity, Unique } from "typeorm";
import { IAuthEntity } from "../interfaces";

@Entity({ name: "users", synchronize: true })
@Unique(["phone", "email"])
export class AuthEntity extends DefaultEntity implements IAuthEntity {
  @Column({ type: "varchar", length: 50 })
  @AutoMap()
  @IsNotEmpty()
  email: string;

  @Column({ type: "varchar", length: 50 })
  @AutoMap()
  @IsNotEmpty()
  password: string;

  @Column({ type: "varchar", length: 50 })
  @AutoMap()
  @IsNotEmpty()
  avatar: string;

  @Column({ type: "varchar", length: 50 })
  @AutoMap()
  @IsNotEmpty()
  nickName: string;

  @Column({ type: "varchar", length: 50 })
  @AutoMap()
  @IsNotEmpty()
  fullName: string;

  @Column({ type: "varchar", length: 12 })
  @AutoMap()
  @IsNotEmpty()
  phone: string;

  @Column({ type: "varchar", length: 6 })
  @AutoMap()
  @IsNotEmpty()
  gender: string;
}
