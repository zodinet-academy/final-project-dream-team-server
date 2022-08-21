import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserBlockDto {
  @ApiProperty({
    description: "blocked user id",
  })
  @IsString()
  @IsNotEmpty()
  blockedUserId: string;
}
