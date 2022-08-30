import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";
import { IUserImageEntity } from "../interfaces";

export class ChangeFavoriteImageDto implements IUserImageEntity {
  @ApiProperty({ description: "id of image" })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
