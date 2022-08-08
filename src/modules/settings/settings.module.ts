import { SettingsRepository } from "./settings.repositoty";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { SettingsService } from "./settings.service";
import { SettingsController } from "./settings.controller";

@Module({
  imports: [TypeOrmModule.forFeature([SettingsRepository])],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
