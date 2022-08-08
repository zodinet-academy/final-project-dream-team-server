import { IUserEntity } from "./../interfaces/user-entity.interface";
import { GenderEnum } from "./../../../constants/gender.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto implements IUserEntity {
  @ApiProperty({
    description: "email",
    default: "zodinet@gmail.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "nickname",
    default: "nickname",
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    description: "fullname",
    default: "fullname",
  })
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({
    description: "phone",
    default: "0764079970",
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: "gender",
    enum: GenderEnum,
    default: GenderEnum.FEMALE,
  })
  @IsString()
  @IsNotEmpty()
  gender: GenderEnum;

  @ApiProperty({
    description: "otp",
    default: "123456",
  })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
