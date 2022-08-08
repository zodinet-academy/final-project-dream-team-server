import { AutoMap } from "@automapper/classes";
import { IsNotEmpty } from "class-validator";
import { Column, Entity } from "typeorm";
import { DefaultEntity } from "../../../common/entity";
import { IProductImagesEntity } from "../interfaces/product-images-entity.interface";

@Entity({ name: "product_images", synchronize: true })
export class ProductImagesEntity
  extends DefaultEntity
  implements IProductImagesEntity {
  @Column({ type: "varchar" })
  @IsNotEmpty()
  @AutoMap()
  productId: string;

  @Column({ type: "varchar" })
  @IsNotEmpty()
  @AutoMap()
  image: string;

  @Column({ type: "varchar" })
  @IsNotEmpty()
  @AutoMap()
  publicId: string;

  @Column({ type: "boolean" })
  @IsNotEmpty()
  @AutoMap()
  isDefault: boolean;
}
