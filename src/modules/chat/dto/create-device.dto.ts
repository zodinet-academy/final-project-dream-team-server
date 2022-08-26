import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateDeviceDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  socketId: string;
}
