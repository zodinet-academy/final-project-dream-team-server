import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from "@nestjs/common";
import { PurposeSettingsService } from "./purpose-settings.service";
import { CreatePurposeSettingDto } from "./dto/create-purpose-setting.dto";
import { UpdatePurposeSettingDto } from "./dto/update-purpose-setting.dto";
import { ApiConsumes, ApiTags, ApiBody } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { imageFileFilter } from "../../common/helper/imageFilter.helper";

@Controller("purpose-settings")
@ApiTags("purpose-settings")
export class PurposeSettingsController {
  constructor(
    private readonly purposeSettingsService: PurposeSettingsService
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: imageFileFilter,
    })
  )
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
        title: { type: "string", nullable: true },
        description: { type: "string", nullable: true },
      },
    },
  })
  create(
    @Body() createPurposeSettingDto: CreatePurposeSettingDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.purposeSettingsService.create(createPurposeSettingDto, file);
  }

  @Get()
  findAll() {
    return this.purposeSettingsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.purposeSettingsService.findOne(id);
  }

  @Put(":id")
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: imageFileFilter,
    })
  )
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
        title: { type: "string", nullable: true },
        description: { type: "string", nullable: true },
      },
    },
  })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updatePurposeSettingDto: UpdatePurposeSettingDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.purposeSettingsService.update(
      id,
      updatePurposeSettingDto,
      file
    );
  }

  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.purposeSettingsService.remove(id);
  }
}
