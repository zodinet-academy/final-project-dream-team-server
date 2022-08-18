import { PurposeSettingsRepository } from "./purpose-settings.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { PurposeSettingsService } from "./purpose-settings.service";
import { PurposeSettingsController } from "./purpose-settings.controller";

@Module({
  imports: [TypeOrmModule.forFeature([PurposeSettingsRepository])],
  controllers: [PurposeSettingsController],
  providers: [PurposeSettingsService],
  exports: [PurposeSettingsService],
})
export class PurposeSettingsModule {}
