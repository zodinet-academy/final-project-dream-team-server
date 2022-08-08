import { EntityRepository, Repository } from "typeorm";
import { ProductImagesEntity } from "./entities/product-images.entity";

@EntityRepository(ProductImagesEntity)
export class ProductImagesRepository extends Repository<ProductImagesEntity> {}
