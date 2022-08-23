import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";

export class DeleteUserLikeStackDto {
  @ApiProperty({
    description: "list id deleted",
  })
  @IsArray()
  @IsNotEmpty()
  ids: string[];
}
