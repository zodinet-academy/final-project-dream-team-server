import { OtpModule } from "./../otp/otp.module";
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [UsersModule, OtpModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
