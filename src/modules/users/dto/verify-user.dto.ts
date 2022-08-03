import { IUserEntity } from "./../interfaces/user-entity.interface";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class VerifyUserDto implements IUserEntity {
  @ApiProperty({
    description: "phone",
    default: "0764079970",
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
