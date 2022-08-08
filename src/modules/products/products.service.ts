import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { ResponseDto } from "../../common/response.dto";
import { getDataError, getDataSuccess } from "../../common/utils";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { CreateProductImageDto } from "../product-images/dto";
import { ProductImagesService } from "../product-images/product-images.service";
import { CreateProductDto, ResponseProductDto, UpdateProductDto } from "./dto";
import { ProductEntity } from "./entities/product.entity";
import { ProductsRepository } from "./products.repository";

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productImageSservice: ProductImagesService,
    private readonly cloudinaryService: CloudinaryService,
    @InjectMapper() private readonly mapper: Mapper
  ) {}

  async createProduct(
    product: CreateProductDto,
    files: Array<Express.Multer.File>
  ): Promise<ResponseDto<string>> {
    try {
      const productResult = await this.productsRepository.save(product);
      if (!productResult) {
        return getDataError(
          false,
          "CREATE_PRODUCT_FAIL",
          "",
          "An error has occured when create a new product."
        );
      }

      const saveImages = await this.saveProductImages(files, productResult.id);
      if (!saveImages)
        return getDataError(false, "SAVE_PRODUCT_IMAGES_ERROR", "", "");

      return getDataSuccess(true, "", "Create product success.");
    } catch (error) {
      return getDataError(false, "CREATE_PRODUCT-ERROR", "", "");
    }
  }

  private async saveProductImages(
    files: Array<Express.Multer.File>,
    productId: string
  ): Promise<boolean> {
    const images = await this.cloudinaryService.uploadMultipleImages(files);
    if (!images) {
      return false;
    }

    const length = images.length;
    for (let i = 0; i < length; i++) {
      const productImage: CreateProductImageDto = {
        image: images[i].url,
        publicId: images[i].publicId,
        productId: productId,
        isDefault: i === 0 ? true : false,
      };

      const result = await this.productImageSservice.saveProductImage(
        productImage
      );
      if (!result) return false;
    }

    return true;
  }

  async getAllProducts(): Promise<ResponseDto<ResponseProductDto[]>> {
    const products = await this.productsRepository.find();

    const listProducts = this.mapper.mapArray(
      products,
      ProductEntity,
      ResponseProductDto
    );

    const length = listProducts.length;
    for (let i = 0; i < length; i++) {
      const images = await this.productImageSservice.getImagesOfAProduct(
        listProducts[i].id
      );
      listProducts[i].images = images;
    }

    return getDataSuccess(true, listProducts, "");
  }

  async updateProductWithoutImages(
    product: UpdateProductDto
  ): Promise<ResponseDto<string>> {
    const oldProduct = await this.findProductById(product.id);
    if (!oldProduct) return getDataError(false, "PRODUCT_NOT_FOUND", "", "");

    const { affected } = await this.productsRepository.update(
      {
        id: product.id,
      },
      {
        name: product.name,
        price: product.price,
        description: product.description,
      }
    );

    if (affected <= 0)
      return getDataError(false, "UPDATE_PRODUCT_FAIL", "", "");

    return getDataSuccess(true, "UPDATE_PRODUCT_SUCCESS", "");
  }

  async findProductById(productId: string): Promise<ProductEntity> {
    const result = await this.productsRepository.findOne({ id: productId });
    return result;
  }

  async addImageToProduct(
    productId: string,
    file: Express.Multer.File
  ): Promise<ResponseDto<string>> {
    const product = await this.findProductById(productId);
    if (!product) return getDataError(false, "PRODUCT_NOT_FOUND", "", "");

    const resultAddImage = await this.productImageSservice.addProductImage(
      productId,
      file
    );

    return resultAddImage;
  }

  async deleteProduct(productId: string) {
    const product = await this.findProductById(productId);
    if (!product) return getDataError(false, "PRODUCT_NOT_FOUND", "", "");

    const responseDeleteImages = await this.productImageSservice.deleteProductImages(
      productId
    );
    if (!responseDeleteImages.status) return responseDeleteImages;

    const { affected } = await this.productsRepository.delete({
      id: productId,
    });
    if (affected <= 0)
      return getDataError(false, "DELETE_PRODUCT_DATABASE_ERROR", "", "");

    return getDataSuccess(true, "", "Delete product success");
  }
}
