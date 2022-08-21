import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { UserImagesDto } from "./dto";
import { IUserImagesService } from "./interfaces/user-images-service.interface";
import { UserImagesRepository } from "./user-images.repository";

@Injectable()
export class UserImagesService implements IUserImagesService {
  constructor(
    private readonly userImagesRepository: UserImagesRepository,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async getUserAlbum(userId: string): Promise<UserImagesDto[] | undefined> {
    const images = await this.userImagesRepository.find({ userId: userId });
    if (!images) return undefined;

    const userAlbum: UserImagesDto[] = [];

    for (let i = 0; i < images.length; i++) {
      const url = await this.cloudinaryService.getImageUrl(images[i].cloudId);
      if (!url) return undefined;

      const image: UserImagesDto = {
        id: images[i].id,
        url: url,
      };

      userAlbum.push(image);
    }

    return userAlbum;
  }
}
