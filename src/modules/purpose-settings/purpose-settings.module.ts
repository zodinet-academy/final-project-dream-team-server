import { PurposeSettingsRepository } from "./purpose-settings.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { PurposeSettingsService } from "./purpose-settings.service";
import { PurposeSettingsController } from "./purpose-settings.controller";
import { PurposeSettingProfile } from "./purpose-settings.profile";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([PurposeSettingsRepository]),
    CloudinaryModule,
  ],
  controllers: [PurposeSettingsController],
  providers: [PurposeSettingsService, PurposeSettingProfile],
  exports: [PurposeSettingsService],
})
export class PurposeSettingsModule {}
