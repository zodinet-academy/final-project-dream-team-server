import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateSettingDto {
  @ApiProperty({
    description: "radius (km)",
    default: 1,
  })
  @IsNumber()
  radius: number;
}
