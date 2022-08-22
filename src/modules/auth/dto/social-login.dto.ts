import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { GenderEnum, SocialEnum } from "../../../constants/enum";
import { IUserEntity } from "../../users/interfaces";

export class SocialDTO implements IUserEntity {
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    example: "",
  })
  accessToken: string;
  @ApiProperty({ enum: SocialEnum })
  @IsEnum(SocialEnum)
  @IsOptional()
  typeSocial: string;
  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  @ApiProperty({
    example: "abc@zodinet.com",
  })
  email: string;
  @IsNotEmpty()
  @ApiProperty({
    example: "nguyen vang ab",
  })
  @IsOptional()
  name: string;
  @ApiProperty()
  @IsOptional()
  url: string;
  @ApiProperty()
  @IsOptional()
  gender: GenderEnum;
  @ApiProperty()
  @IsOptional()
  birthday?: Date;
}
