import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { IAdminEntity } from "../interfaces";

export class CreateAdminsDto implements IAdminEntity {
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
    description: "name",
    default: "Nguyen Van A",
  })
  @IsEmail()
  @IsNotEmpty()
  name: string;
}
