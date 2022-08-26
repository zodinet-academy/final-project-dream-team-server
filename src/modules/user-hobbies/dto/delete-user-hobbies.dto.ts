import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";
import { IUserHobbyEntity } from "../interfaces";

export class DeleteUserHobbiesDto implements IUserHobbyEntity {
  @ApiProperty({ description: "id" })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
