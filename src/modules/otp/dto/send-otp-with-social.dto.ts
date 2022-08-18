import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SendOtpWithSocialDto {
  @ApiProperty({ type: String, default: "0869287417" })
  @IsString()
  @IsNotEmpty()
  phone: string;
  @ApiProperty({ type: String, default: "abc@gmail.com" })
  @IsEmail()
  email: string;
}
