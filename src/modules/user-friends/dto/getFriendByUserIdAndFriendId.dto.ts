import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class GetFriendByUserIdAndFriendIdDto {
  @ApiProperty({
    example: "33734a5e-596d-44f3-9fb8-84800ac4b9c8",
    description: "The id of the user",
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    example: "92c00939-c312-4302-bd46-13e1628a015c",
    description: "The id of the user",
  })
  @IsNotEmpty()
  @IsUUID()
  friendId: string;
}
