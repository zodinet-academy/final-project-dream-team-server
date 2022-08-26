import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { UserImagesProfile } from "./user-images.profile";
import { UserImagesRepository } from "./user-images.repository";
import { UserImagesService } from "./user-images.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserImagesRepository]), CloudinaryModule],
  providers: [UserImagesService, UserImagesProfile],
  exports: [UserImagesService],
})
export class UserImagesModule {}
