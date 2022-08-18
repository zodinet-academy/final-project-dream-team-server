import { IUserEntity } from "./../interfaces/user-entity.interface";
import { ApiProperty } from "@nestjs/swagger";
import { GenderEnum } from "../../../constants/enum";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { UserEntity } from "../entities/user.entity";

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
