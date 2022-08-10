import { SettingsModule } from "./../settings/settings.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { UserLocationsService } from "./user-locations.service";
import { UserLocationsController } from "./user-locations.controller";
import { UserLocationsRepository } from "./user-locations.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLocationsRepository]),
    SettingsModule,
  ],
  controllers: [UserLocationsController],
  providers: [UserLocationsService],
  exports: [UserLocationsService],
})
export class UserLocationsModule {}
