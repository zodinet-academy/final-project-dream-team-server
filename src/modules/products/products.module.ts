import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { ProductImagesModule } from "../product-images/product-images.module";
import { ProductsController } from "./products.controller";
import { ProductProfile } from "./products.profile";
import { ProductsRepository } from "./products.repository";
import { ProductsService } from "./products.service";

@Module({
  imports: [
    CloudinaryModule,
    ProductImagesModule,
    TypeOrmModule.forFeature([ProductsRepository]),
  ],
  providers: [ProductsService, ProductProfile],
  controllers: [ProductsController],
})
export class ProductsModule {}
