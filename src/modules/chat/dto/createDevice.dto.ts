import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateDeviceDto {
  @IsNotEmpty()
  @IsUUID()
  conversationId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  socketId: string;
}
