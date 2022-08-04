import { OtpModule } from "./../otp/otp.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PublicUsersController } from "./public-users.controller";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";
import { MatchingUsersModule } from "../matching-users/matching-users.module";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes";
import { UserProfile } from "./user.profile";

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRepository]),
    OtpModule,
    MatchingUsersModule,
  ],
  controllers: [UsersController, PublicUsersController],
  providers: [UsersService, UserProfile],
  exports: [UsersService],
})
export class UsersModule {}
