import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { GenderEnum } from "../../../constants/enum";
import { IUserEntity } from "./../interfaces/user-entity.interface";

export class CreateUserDto implements IUserEntity {
  @IsOptional()
  @ApiProperty()
  @IsEmail()
  email: string;
  @IsOptional()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsOptional()
  @ApiProperty()
  gender: GenderEnum;
  @IsOptional()
  @ApiProperty()
  avatar?: string;
  @IsOptional()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  birthday: Date;
}
