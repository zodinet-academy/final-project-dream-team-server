import { IPurposeSettingsEntity } from "./../interfaces/purpose-setting-entity.interface";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreatePurposeSettingDto implements IPurposeSettingsEntity {
  @ApiProperty({
    description: "title of purpose",
    default: "Muốn hẹn hò",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "description of purpose",
    default: "Tìm sgbb/ sgdd :)",
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: "image",
    default: "file/zt5jtrgktciqvm0rxbws.jpg",
  })
  @IsString()
  @IsNotEmpty()
  image: string;
}
