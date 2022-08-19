import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class GetByConversationIdDto {
  @ApiProperty({
    example: "c1c9ef56-a418-420e-82e0-cd28293e0b56",
    description: "The id of the conversation",
  })
  @IsNotEmpty()
  @IsUUID()
  conversationId: string;
}
