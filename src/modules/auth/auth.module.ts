import { HttpModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AdminsModule } from "../admins/admins.module";
import { UsersModule } from "../users/users.module";
import { OtpModule } from "./../otp/otp.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import { SocialGuard } from "./guards/social.guard";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    OtpModule,
    UsersModule,
    AdminsModule,
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: { expiresIn: configService.get("JWT_EXPIRATION_TIME") },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, SocialGuard],
  controllers: [AuthController],
})
export class AuthModule {}
