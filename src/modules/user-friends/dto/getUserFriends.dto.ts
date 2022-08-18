import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class GetUserFriendsDto {
  @ApiProperty({
    example: "33734a5e-596d-44f3-9fb8-84800ac4b9c8",
    description: "The id of the user",
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
