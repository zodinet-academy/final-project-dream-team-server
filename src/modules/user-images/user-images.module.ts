import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserImagesProfile } from "./user-images.profile";
import { UserImagesRepository } from "./user-images.repository";
import { UserImagesService } from "./user-images.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserImagesRepository])],
  providers: [UserImagesService, UserImagesProfile],
  exports: [UserImagesService],
})
export class UserImagesModule {}
