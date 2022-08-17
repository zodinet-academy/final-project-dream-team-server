import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { UserImagesDto } from "./dto";
import { UserImageEntity } from "./entities/user-images.entity";
import { IUserImagesService } from "./interfaces/user-images-service.interface";
import { UserImagesRepository } from "./user-images.repository";

@Injectable()
export class UserImagesService implements IUserImagesService {
  constructor(
    private readonly userImagesRepository: UserImagesRepository,
    @InjectMapper() private readonly mapper: Mapper
  ) {}

  async getUserAlbum(userId: string): Promise<UserImagesDto[] | undefined> {
    const images = await this.userImagesRepository.find({ userId: userId });
    if (!images) return undefined;

    const userAlbum = this.mapper.mapArray(
      images,
      UserImageEntity,
      UserImagesDto
    );

    return userAlbum;
  }
}
