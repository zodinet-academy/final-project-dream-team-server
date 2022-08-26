import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { SocialEnum } from "../../../constants/enum";
import { IUserEntity } from "../../users/interfaces";

export class CheckUserVerifiedDTO implements IUserEntity {
  @IsOptional()
  @ApiProperty()
  @IsEmail()
  email: string;
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
}
