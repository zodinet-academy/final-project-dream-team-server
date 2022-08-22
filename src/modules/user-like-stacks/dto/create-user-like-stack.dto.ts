import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";
import { IUserLikeStackEntity } from "./../interfaces/user-like-stack-entity.interface";
export class CreateUserLikeStackDto implements IUserLikeStackEntity {
  @ApiProperty({
    description: "to user id",
  })
  @IsUUID()
  @IsNotEmpty()
  toUserId: string;
}
