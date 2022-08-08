import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, IsString } from "class-validator";
import { IProductEntity } from "../interfaces";

export class CreateProductDto implements IProductEntity {
  @ApiProperty({ description: "name", default: "Product 1" })
  @IsString()
  @IsNotEmpty()
  @AutoMap()
  name: string;

  @ApiProperty({ description: "price", default: "100000", type: Number })
  @IsNumberString()
  @IsNotEmpty()
  @AutoMap()
  price: number;

  @ApiProperty({
    description: "description",
    default: "Lorium Lorium Lorium Lorium",
  })
  @IsString()
  @IsNotEmpty()
  @AutoMap()
  description: string;
}
