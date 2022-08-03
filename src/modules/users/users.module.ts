import { OtpModule } from "./../otp/otp.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PublicUsersController } from "./public-users.controller";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository]), OtpModule],
  controllers: [UsersController, PublicUsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
