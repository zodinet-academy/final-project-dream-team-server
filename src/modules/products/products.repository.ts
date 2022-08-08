import { EntityRepository, Repository } from "typeorm";
import { ProductEntity } from "./entities/product.entity";

@EntityRepository(ProductEntity)
export class ProductsRepository extends Repository<ProductEntity> {}
