import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AddImageProductDto {
  @ApiProperty({ description: "product Id", default: "dsie-2lkj2-dfk99" })
  @IsString()
  @IsNotEmpty()
  id: string;
}
