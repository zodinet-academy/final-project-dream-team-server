import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "../../common/response.dto";
import { ParseFile } from "./decorator/parse-file.pipe";
import {
  AddImageProductDto,
  CreateProductDto,
  ResponseProductDto,
  UpdateProductDto,
} from "./dto";
import { ProductsService } from "./products.service";

@Controller("products")
@ApiTags("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: "Create product" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FilesInterceptor("files"))
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        price: { type: "number" },
        description: { type: "string" },
        files: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
        },
      },
      required: ["name", "price", "description", "files"],
    },
  })
  createProduct(
    @Body() product: CreateProductDto,
    @UploadedFiles()
    files: Array<Express.Multer.File>
  ): Promise<ResponseDto<string>> {
    if (files.length === 0)
      throw new BadRequestException(["files is require"], "Validation failt");
    return this.productsService.createProduct(product, files);
  }

  @Get()
  @ApiOperation({ summary: "Get all products" })
  getAllProducts(): Promise<ResponseDto<ResponseProductDto[]>> {
    return this.productsService.getAllProducts();
  }

  @Put()
  @ApiOperation({ summary: "Update product without images" })
  updateProductWithoutImages(@Body() data: UpdateProductDto) {
    return this.productsService.updateProductWithoutImages(data);
  }

  @Post("addImage")
  @ApiOperation({ summary: "Add image to a product" })
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        file: {
          type: "string",
          format: "binary",
        },
      },
      required: ["id", "file"],
    },
  })
  addImageProduct(
    @Body() dto: AddImageProductDto,
    @UploadedFile(ParseFile) file: Express.Multer.File
  ) {
    if (!file)
      throw new BadRequestException(["file is require"], "Validation failt");
    return this.productsService.addImageToProduct(dto.id, file);
  }

  @Delete(":productId")
  @ApiOperation({ summary: "Delete a product" })
  deleteProduct(@Param("productId") productId: string) {
    return this.productsService.deleteProduct(productId);
  }
}
