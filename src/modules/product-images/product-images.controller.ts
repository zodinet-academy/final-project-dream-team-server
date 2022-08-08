import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "../../common/response.dto";
import { UpdateProductImagesDto } from "./dto";
import { ProductImagesService } from "./product-images.service";

@Controller("product-images")
@ApiTags("product-images")
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @Put()
  @ApiOperation({ summary: "update an image of a product" })
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        imageId: { type: "string" },
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  updateProductImage(
    @Body() data: UpdateProductImagesDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<ResponseDto<string>> {
    return this.productImagesService.updateProductImage(data.imageId, file);
  }

  @Delete(":imageId")
  @ApiOperation({ summary: "Delete an image of a product" })
  deleteImage(@Param("imageId") imageId: string): Promise<ResponseDto<string>> {
    return this.productImagesService.deleteImage(imageId);
  }
}
