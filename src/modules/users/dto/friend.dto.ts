import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";
import { IUserEntity } from "../interfaces";

export class FriendDto implements IUserEntity {
  @ApiProperty({
    description: "uuid",
    default: "kffksdjfslkdjwoiejd",
  })
  @IsString()
  @IsNotEmpty()
  @AutoMap()
  id: string;

  @ApiProperty({
    description: "avatar",
    default: "avatar",
  })
  @IsString()
  @IsNotEmpty()
  @AutoMap()
  avatar: string;

  @ApiProperty({
    description: "nickname",
    default: "nickname",
  })
  @IsString()
  @IsNotEmpty()
  @AutoMap()
  nickname: string;

  @ApiProperty({
    description: "fullname",
    default: "fullname",
  })
  @IsString()
  @IsNotEmpty()
  @AutoMap()
  fullname: string;
}
