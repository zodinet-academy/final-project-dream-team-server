import { Module } from "@nestjs/common";
import { UserProfile } from "../users/user.mapper";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, UserProfile],
  exports: [AuthService],
})
export class AuthModule {}
