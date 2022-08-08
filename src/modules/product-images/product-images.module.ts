import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { ProductImagesController } from "./product-images.controller";
import { ProductImagesProfile } from "./product-images.profile";
import { ProductImagesRepository } from "./product-images.repository";
import { ProductImagesService } from "./product-images.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductImagesRepository]),
    CloudinaryModule,
  ],
  providers: [ProductImagesService, ProductImagesProfile],
  controllers: [ProductImagesController],
  exports: [ProductImagesService],
})
export class ProductImagesModule {}
