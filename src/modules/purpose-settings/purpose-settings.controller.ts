import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from "@nestjs/common";
import { PurposeSettingsService } from "./purpose-settings.service";
import { CreatePurposeSettingDto } from "./dto/create-purpose-setting.dto";
import { UpdatePurposeSettingDto } from "./dto/update-purpose-setting.dto";
import { ApiTags } from "@nestjs/swagger";

@Controller("purpose-settings")
@ApiTags("purpose-settings")
export class PurposeSettingsController {
  constructor(
    private readonly purposeSettingsService: PurposeSettingsService
  ) {}

  @Post()
  create(@Body() createPurposeSettingDto: CreatePurposeSettingDto) {
    return this.purposeSettingsService.create(createPurposeSettingDto);
  }

  @Get()
  findAll() {
    return this.purposeSettingsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.purposeSettingsService.findOne(id);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updatePurposeSettingDto: UpdatePurposeSettingDto
  ) {
    return this.purposeSettingsService.update(id, updatePurposeSettingDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.purposeSettingsService.remove(id);
  }
}
