import { AdminsService } from "./admins.service";
import { AdminsRepository } from "./admins.repository";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminsController } from "./admins.controller";

@Module({
  imports: [TypeOrmModule.forFeature([AdminsRepository])],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [AdminsService],
})
export class AdminsModule {}
