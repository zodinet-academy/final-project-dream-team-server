import {
  IsBase64,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

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
  friendId: string;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  conversationId: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsOptional()
  image?: Express.Multer.File;
}

export class MessageReceived {
  content: string;
  image: string;
}
