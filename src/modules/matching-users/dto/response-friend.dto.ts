import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UserId {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
}
