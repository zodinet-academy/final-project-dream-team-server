import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "../../common/repository";
import { UserEntity } from "./entities/user.entity";
import { UserProfile } from "./user.mapper";
import { UserRepository } from "./user.repository";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, Repository])],
  controllers: [UsersController],
  providers: [UsersService, UserProfile],
  exports: [UsersService],
})
export class UsersModule {}
