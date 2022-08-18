import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class GetConversationByUserIdAndFriendIdDto {
  @ApiProperty({
    example: "33734a5e-596d-44f3-9fb8-84800ac4b9c8",
    description: "The id of the user",
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    example: "66a5bdae-5c2d-45cb-9322-a2da9ecedd2b",
    description: "The id of the user",
  })
  @IsNotEmpty()
  @IsUUID()
  friendId: string;
}
