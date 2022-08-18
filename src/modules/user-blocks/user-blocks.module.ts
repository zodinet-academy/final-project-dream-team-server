import { Module } from "@nestjs/common";
import { UserBlocksService } from "./user-blocks.service";
import { UserBlocksController } from "./user-blocks.controller";

@Module({
  controllers: [UserBlocksController],
  providers: [UserBlocksService],
})
export class UserBlocksModule {}
