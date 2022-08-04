import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class VerifyOtpDto {
  @ApiProperty({ type: String, default: "0869287417" })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ type: String, default: "777777" })
  @IsString()
  @IsNotEmpty()
  code: string;
}
