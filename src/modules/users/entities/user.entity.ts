import { AutoMap } from "@automapper/classes";
import { DefaultEntity } from "src/common/entity";
import { Column, Entity } from "typeorm";

@Entity({ name: "users", synchronize: true }) // bat buoc co, false: migration bo qua,
export class User extends DefaultEntity {
  @Column({ type: "varchar", length: 25, nullable: false })
  @AutoMap()
  nick_name: string;

  @Column({ type: "varchar", length: 25, nullable: false })
  @AutoMap()
  full_name: string;
}
