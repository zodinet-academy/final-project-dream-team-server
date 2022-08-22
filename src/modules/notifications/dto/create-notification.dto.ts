import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { NotificationEnum } from "../../../constants/enum";
import { INotificationEntity } from "./../interfaces/notification-entity.interface";
export class CreateNotificationDto implements INotificationEntity {
  @ApiProperty({
    description: "type of notification",
  })
  @IsEnum(NotificationEnum)
  @IsNotEmpty()
  type: NotificationEnum;

  @ApiProperty({
    description: "message",
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: "receiver user id",
  })
  @IsUUID()
  @IsNotEmpty()
  receiverId: string;
}
