import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateProductImagesDto {
  @ApiProperty({ description: "id", default: "sdkfj-sdkfjw-sdkjf-we" })
  @IsString()
  @IsNotEmpty()
  imageId: string;
}
