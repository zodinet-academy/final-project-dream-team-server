import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MatchingUsersController } from "./matching-users.controller";
import { MatchingUsersRepository } from "./matching-users.repository";
import { MatchingUsersService } from "./matching-users.service";

@Module({
  imports: [TypeOrmModule.forFeature([MatchingUsersRepository])],
  providers: [MatchingUsersService],
  controllers: [MatchingUsersController],
  exports: [MatchingUsersService],
})
export class MatchingUsersModule {}
