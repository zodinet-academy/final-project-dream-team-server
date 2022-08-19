import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { IUserHobbyEntity } from "../interfaces";

export class CreateUserHobbiesDto implements IUserHobbyEntity {
  @ApiProperty({ description: "name" })
  @IsNotEmpty()
  @IsString()
  name: string;
}
