import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class GetByConversationIdDto {
  @ApiProperty({
    example: "ed53cc01-b203-4abc-b4fa-694f6d77e5f6",
    description: "The id of the conversation",
  })
  @IsNotEmpty()
  @IsUUID()
  conversationId: string;
}
