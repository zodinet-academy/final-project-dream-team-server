import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { AuthProfile } from "./auth.mapper";
import { AuthService } from "./auth.service";
import { AuthEntity } from "./entities/auth.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AuthEntity])],
  controllers: [AuthController],
  providers: [AuthService, AuthProfile],
  exports: [AuthService],
})
export class AuthModule {}
