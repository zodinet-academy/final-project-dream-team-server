import { AutoMap } from "@automapper/classes";
import { IProductImagesEntity } from "../interfaces/product-images-entity.interface";

export class ResponseProductImagesDto implements IProductImagesEntity {
  @AutoMap()
  id: string;

  @AutoMap()
  image: string;

  @AutoMap()
  publicId: string;

  @AutoMap()
  isDefault: boolean;
}
