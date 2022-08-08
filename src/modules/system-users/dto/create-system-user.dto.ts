import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { GenderEnum } from "../../../constants";
import { ISystemUserEntity } from "./../interfaces/system-user-entity.interface";
export class CreateSystemUserDto implements ISystemUserEntity {
  @ApiProperty({
    description: "user name",
    default: "Admin",
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: "password",
    default: "123456",
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: "email",
    default: "zodinet@gmail.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "phone",
    default: "1234565789",
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: "gender",
    default: GenderEnum.MALE,
  })
  @IsEnum(GenderEnum)
  gender: GenderEnum;
}
