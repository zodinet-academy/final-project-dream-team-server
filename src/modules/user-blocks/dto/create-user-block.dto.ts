import { IUserBlockEntity } from "./../interfaces/user-block-entity.interface";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserBlockDto implements IUserBlockEntity {
  @ApiProperty({
    description: "blocked user id",
  })
  @IsString()
  @IsNotEmpty()
  blockedUserId: string;
}
