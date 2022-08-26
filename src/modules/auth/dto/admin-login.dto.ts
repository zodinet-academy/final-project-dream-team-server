import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { IAdminEntity } from "../../admins/interfaces";
export class AdminLoginDto implements IAdminEntity {
  @ApiProperty({
    example: "Admin",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: "123456",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
