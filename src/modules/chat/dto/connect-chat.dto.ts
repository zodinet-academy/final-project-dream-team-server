import { IsNotEmpty, IsUUID } from "class-validator";

export class ConnectChatDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  friendId: string;
}
