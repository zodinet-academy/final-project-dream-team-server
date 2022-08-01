import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SendOtpDto {
  @ApiProperty({ type: String, default: "0869287417" })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
