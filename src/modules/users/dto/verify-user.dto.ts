import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class VerifyUserDto {
  @ApiProperty({
    description: "phone",
    default: "0764079970",
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
