import { AutoMap } from "@automapper/classes";
import { ResponseProductImagesDto } from "../../product-images/dto";
import { IProductEntity } from "../interfaces";
import { CreateProductDto } from "./create-product.dto";

export class ResponseProductDto
  extends CreateProductDto
  implements IProductEntity {
  @AutoMap()
  id: string;

  @AutoMap()
  images: ResponseProductImagesDto[];
}
