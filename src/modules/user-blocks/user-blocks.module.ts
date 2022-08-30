import { UserBlocksRepository } from "./user-blocks.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { UserBlocksService } from "./user-blocks.service";
import { UserBlocksController } from "./user-blocks.controller";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([UserBlocksRepository]), UsersModule],
  controllers: [UserBlocksController],
  providers: [UserBlocksService],
  exports: [UserBlocksService],
})
export class UserBlocksModule {}
