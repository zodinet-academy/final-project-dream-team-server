import { NotificationEnum } from "./../../../constants/enum";
import { IsBoolean, IsEnum, IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { DefaultEntity } from "../../../common/entity";
import { UserEntity } from "../../users/entities/user.entity";
import { INotificationEntity } from "../interfaces";

@Entity({ name: "notifications", synchronize: true }) // bat buoc co, false: migration bo qua,
export class NotificationEntity
  extends DefaultEntity
  implements INotificationEntity {
  @Column({ type: "varchar", nullable: false })
  @IsEnum(NotificationEnum)
  type: NotificationEnum;

  @Column({ type: "varchar", nullable: false })
  @IsNotEmpty()
  message: string;

  @Column({ name: "is_read", type: "boolean", nullable: false, default: false })
  @IsBoolean()
  isRead: boolean;

  @Column({ name: "receiver_id", type: "varchar", nullable: false })
  @IsNotEmpty()
  receiverId: string;

  @ManyToOne(() => UserEntity, (entity) => entity.id)
  @JoinColumn({
    name: "receiver_id",
    referencedColumnName: "id",
  })
  user: UserEntity;
}
