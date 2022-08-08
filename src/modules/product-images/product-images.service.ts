import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { ResponseDto } from "../../common/response.dto";
import { getDataError, getDataSuccess } from "../../common/utils";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { CreateProductImageDto, ResponseProductImagesDto } from "./dto";
import { ProductImagesEntity } from "./entities/product-images.entity";
import { ProductImagesRepository } from "./product-images.repository";

@Injectable()
export class ProductImagesService {
  constructor(
    private readonly productImagesRespository: ProductImagesRepository,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async saveProductImage(data: CreateProductImageDto): Promise<boolean> {
    try {
      await this.productImagesRespository.save(data);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getImagesOfAProduct(
    productId: string
  ): Promise<ResponseProductImagesDto[]> {
    const productImages = await this.productImagesRespository.find({
      productId: productId,
    });
    const images = this.mapper.mapArray(
      productImages,
      ProductImagesEntity,
      ResponseProductImagesDto
    );
    return images;
  }

  async updateProductImage(imageIdChange: string, file: Express.Multer.File) {
    const productImage = await this.findProductImageById(imageIdChange);
    if (!productImage)
      return getDataError(false, "NOT_FOUND_PRODUCT_IMAGE", "", "");

    const isDeleted = await this.cloudinaryService.deleteImage(
      productImage.publicId
    );
    if (!isDeleted)
      return getDataError(false, "DELETE_IMAGE_CLOUDINARY_ERROR", "", "");

    const uploadResult = await this.cloudinaryService.uploadFile(file);
    if (!uploadResult.url)
      return getDataError(false, "UPLOAD_IMAGE_CLOUDINARY_ERROR", "", "");

    const { affected } = await this.productImagesRespository.update(
      { id: imageIdChange },
      { image: uploadResult.url, publicId: uploadResult.public_id }
    );

    if (affected <= 0)
      return getDataError(false, "UPDATE_IMAGE_DATABASE_FAIL", "", "");

    return getDataSuccess(true, "", "Update image success.");
  }

  async deleteImage(imageId: string): Promise<ResponseDto<string>> {
    const productImage = await this.findProductImageById(imageId);
    if (!productImage)
      return getDataError(false, "NOT_FOUND_PRODUCT_IMAGE", "", "");

    if (productImage.isDefault)
      return getDataError(false, "CAN_NOT_DELETE_DEFAULT_IMAGE", "", "");

    const isDeleted = await this.cloudinaryService.deleteImage(
      productImage.publicId
    );
    if (!isDeleted)
      return getDataError(false, "DELETE_IMAGE_CLOUDINARY_FAIL", "", "");

    const { affected } = await this.productImagesRespository.delete({
      id: imageId,
    });

    if (affected <= 0)
      return getDataError(false, "DELETE_IMAGE_DATABASE_ERROR", "", "");

    return getDataSuccess(true, "", "Delete image successfully");
  }

  async findProductImageById(id: string) {
    const productImage = await this.productImagesRespository.findOne({
      id: id,
    });
    return productImage;
  }

  async addProductImage(productId: string, file: Express.Multer.File) {
    const uploadImageResponse = await this.cloudinaryService.uploadFile(file);
    if (!uploadImageResponse.url)
      return getDataError(false, "UPLOAD_IMAGE_CLOUDINARY_ERROR", "", "");

    const productImage: CreateProductImageDto = {
      image: uploadImageResponse.url,
      publicId: uploadImageResponse.public_id,
      isDefault: false,
      productId: productId,
    };

    const isSaved = await this.saveProductImage(productImage);
    if (!isSaved)
      return getDataError(false, "SAVE_IMAGE_DATABASE_FAIL", "", "");

    return getDataSuccess(true, "", "Add image to product success.");
  }

  async deleteProductImages(productId: string) {
    const productImages = await this.productImagesRespository.find({
      productId: productId,
    });

    const publicIds = productImages.map((image) => {
      return image.publicId;
    });

    const responeDeleteImagesCloud = await this.cloudinaryService.deleteImages(
      publicIds
    );
    if (!responeDeleteImagesCloud)
      return getDataError(false, "DELETE_IMAGES_CLOUDINARY_ERROR", "", "");

    const length = productImages.length;
    for (let i = 0; i < length; i++) {
      const { affected } = await this.productImagesRespository.delete({
        id: productImages[i].id,
      });
      if (affected <= 0)
        return getDataError(false, "DELETE_IMAGES_DATABASE_ERROR", "", "");
    }

    return getDataSuccess(true, "", "Delete images of product success");
  }
}
