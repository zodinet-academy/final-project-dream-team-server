import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { SocialEnum } from "../../../constants/enum";
import { IUserEntity } from "../../users/interfaces";

export class SocialDTO implements IUserEntity {
  @IsNotEmpty()
  @ApiProperty({
    example: "",
  })
  accessToken: string;
  @ApiProperty({ enum: SocialEnum })
  @IsEnum(SocialEnum)
  typeSocial: string;
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: "abc@zodinet.com",
  })
  email: string;
  @IsNotEmpty()
  @ApiProperty({
    example: "nguyen vang ab",
  })
  name: string;
  @ApiProperty()
  @IsOptional()
  url: string;
}
