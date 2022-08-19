import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class GetFriendByUserIdAndFriendIdDto {
  @ApiProperty({
    example: "995dcb6d-ac35-44a8-8823-0f98fb8341f2",
    description: "The id of the user",
  })
  @IsNotEmpty()
  @IsUUID()
  friendId: string;
}
