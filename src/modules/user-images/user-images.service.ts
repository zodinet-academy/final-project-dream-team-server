import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ResponseDto } from "../../common/response.dto";
import { responseData } from "../../common/utils";
import {
  ERROR_CAN_NOT_FIND_IMAGE,
  ERROR_CAN_NOT_SAVE_USER_IMAGE,
  ERROR_CAN_NOT_SAVE_USER_IMAGE_IN_CLOUD,
  ERROR_EXCEED_MAX_FAVORITE_IMAGE,
  ERROR_IN_DELETE_IMAGE_CLOUD,
  ERROR_UNKNOWN,
  ERROR_USER_NOT_MATCH_WITH_IMAGE,
} from "../../constants/code-response.constant";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { ChangeFavoriteImageDto, UserImagesDto } from "./dto";
import { UserImageEntity } from "./entities/user-images.entity";
import { IUserImagesService } from "./interfaces/user-images-service.interface";
import { UserImagesRepository } from "./user-images.repository";

@Injectable()
export class UserImagesService implements IUserImagesService {
  constructor(
    private readonly userImagesRepository: UserImagesRepository,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly cloudinaryService: CloudinaryService,
    private readonly configService: ConfigService
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
        isFavorite: images[i].isFavorite,
      };

      userAlbum.push(image);
    }

    return userAlbum;
  }

  async addImages(
    userId: string,
    images: Array<Express.Multer.File>
  ): Promise<ResponseDto<string>> {
    for (let i = 0; i < images.length; i++) {
      const res = await this.cloudinaryService.uploadImage(images[i], "images");
      if ("public_id" in res) {
        try {
          await this.userImagesRepository.save(
            this.userImagesRepository.create({
              userId: userId,
              cloudId: res.public_id,
            })
          );
        } catch (error) {
          return responseData(
            "",
            "Can not save user image",
            ERROR_CAN_NOT_SAVE_USER_IMAGE
          );
        }
      } else {
        return responseData(
          "",
          "Can not save user image in cloud",
          ERROR_CAN_NOT_SAVE_USER_IMAGE_IN_CLOUD
        );
      }
    }

    return responseData("Succes", "Save images successfully.");
  }

  async changeFavorite(
    imageId: string,
    userId: string
  ): Promise<ResponseDto<string | UserImagesDto>> {
    const image = await this.userImagesRepository.findOne({ id: imageId });
    if (!image)
      return responseData(null, "Can not find image", ERROR_CAN_NOT_FIND_IMAGE);

    if (userId !== image.userId)
      return responseData(
        null,
        "User not match with image",
        ERROR_USER_NOT_MATCH_WITH_IMAGE
      );

    const numFavoriteImages = await this.countFavoriteImage(userId);
    const maxFavorite = this.configService.get("MAX_FAVORITE");

    if (numFavoriteImages >= maxFavorite && !image.isFavorite)
      return responseData(
        null,
        "Exceed max favorite images",
        ERROR_EXCEED_MAX_FAVORITE_IMAGE
      );

    try {
      await this.userImagesRepository.update(
        { id: imageId },
        { isFavorite: !image.isFavorite }
      );
      image.isFavorite = !image.isFavorite;

      const responseImage = this.mapper.map(
        image,
        UserImageEntity,
        UserImagesDto
      );

      return responseData(responseImage, "Change image favorite success");
    } catch (error) {
      return responseData(null, "Error when update image", ERROR_UNKNOWN);
    }
  }

  async countFavoriteImage(userid: string): Promise<number> {
    const images = await this.getUserAlbum(userid);
    let count = 0;

    images.forEach((image) => {
      if (image.isFavorite) count++;
    });

    return count;
  }

  async deleteImage(userId: string, imageId: string) {
    const image = await this.userImagesRepository.findOne({ id: imageId });
    if (!image)
      return responseData(null, "Can not find image", ERROR_CAN_NOT_FIND_IMAGE);

    if (userId !== image.userId)
      return responseData(
        null,
        "User not match with image",
        ERROR_USER_NOT_MATCH_WITH_IMAGE
      );

    try {
      await this.userImagesRepository.delete({ id: imageId });
      const responseDeleteCloud = this.cloudinaryService.deleteImage(
        image.cloudId
      );
      if (!responseDeleteCloud)
        return responseData(
          null,
          "Error in delete image cloud",
          ERROR_IN_DELETE_IMAGE_CLOUD
        );

      return responseData(imageId, "Delete image success");
    } catch (error) {
      return responseData(null, "Error in delete image", ERROR_UNKNOWN);
    }
  }
}
