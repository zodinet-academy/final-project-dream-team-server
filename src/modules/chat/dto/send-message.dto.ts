import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  socketId: string;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  senderId: string;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  conversationId: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  image?: string;
}

export class MessageReceived {
  content: string;
  image: string;
}
