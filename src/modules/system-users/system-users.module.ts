import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SystemUsersController } from "./system-users.controller";
import { SystemUsersRepository } from "./system-users.repository";
import { SystemUsersService } from "./system-users.service";

@Module({
  imports: [TypeOrmModule.forFeature([SystemUsersRepository])],
  controllers: [SystemUsersController],
  providers: [SystemUsersService],
  exports: [SystemUsersService],
})
export class SystemUsersModule {}
