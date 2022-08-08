import { JwtStrategy } from "./strategies/jwt.strategy";
import { OtpModule } from "./../otp/otp.module";
import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { SystemUsersModule } from "../system-users/system-users.module";

@Module({
  imports: [
    OtpModule,
    UsersModule,
    SystemUsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: { expiresIn: configService.get("JWT_EXPIRATION_TIME") },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
