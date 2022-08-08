import { AutoMap } from "@automapper/classes";
import { IProductImagesEntity } from "../interfaces/product-images-entity.interface";

export class CreateProductImageDto implements IProductImagesEntity {
  @AutoMap()
  image: string;

  @AutoMap()
  productId: string;

  @AutoMap()
  publicId: string;

  @AutoMap()
  isDefault: boolean;
}
