import { PurposeSettingsRepository } from "./purpose-settings.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { PurposeSettingsService } from "./purpose-settings.service";
import { PurposeSettingsController } from "./purpose-settings.controller";
import { PurposeSettingProfile } from "./purpose-settings.profile";

@Module({
  imports: [TypeOrmModule.forFeature([PurposeSettingsRepository])],
  controllers: [PurposeSettingsController],
  providers: [PurposeSettingsService, PurposeSettingProfile],
  exports: [PurposeSettingsService],
})
export class PurposeSettingsModule {}
