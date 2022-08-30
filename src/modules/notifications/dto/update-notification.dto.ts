import { IsBoolean, IsNotEmpty, IsUUID } from "class-validator";

export class UpdateNotificationDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsBoolean()
  isRead: boolean;
}
