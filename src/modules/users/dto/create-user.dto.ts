import { AutoMap } from "@automapper/classes";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @AutoMap()
  email: string;

  @IsString()
  @IsNotEmpty()
  @AutoMap()
  password: string;

  @IsString()
  @IsNotEmpty()
  @AutoMap()
  avatar: string;

  @IsString()
  @IsNotEmpty()
  @AutoMap()
  nickName: string;

  @IsString()
  @IsNotEmpty()
  @AutoMap()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @AutoMap()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @AutoMap()
  gender: string;
}
