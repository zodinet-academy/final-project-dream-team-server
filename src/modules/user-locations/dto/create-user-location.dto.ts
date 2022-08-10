import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { IUserLocationEntity } from "../interfaces";

export class CreateUserLocationDto implements IUserLocationEntity {
  @ApiProperty({
    description: "latitute",
    default: "0",
  })
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @ApiProperty({
    description: "longtitute",
    default: "0",
  })
  @IsNumber()
  @IsNotEmpty()
  long: number;
}
