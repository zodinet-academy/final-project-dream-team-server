import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { IProductEntity } from "../interfaces";
import { CreateProductDto } from "./create-product.dto";

export class UpdateProductDto
  extends CreateProductDto
  implements IProductEntity {
  @ApiProperty({ description: "id", default: "vdie142-dkbjsd-sdkjd" })
  @IsNotEmpty()
  @IsString()
  id: string;
}
