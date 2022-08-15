import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  socket_id: string;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  sender_id: string;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  conversation_id: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  image?: string;
}

export class MessageReceived {
  name: string;
  avatar: string;
  content: string;
  image: string;
}
