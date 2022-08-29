import { Body, Controller, Get, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard, RolesGuard } from "../auth/guards";
import { CreateSettingDto } from "./dto/create-setting.dto";
import { UpdateSettingDto } from "./dto/update-setting.dto";
import { SettingsService } from "./settings.service";

@Controller("secure/settings")
@ApiTags("settings")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
// @Roles(UserRolesEnum.ADMIN)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  createSetting(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.createSetting(createSettingDto);
  }

  @Get()
  findSetting() {
    return this.settingsService.findSetting();
  }

  @Put()
  update(@Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.updateSetting(updateSettingDto);
  }
}
