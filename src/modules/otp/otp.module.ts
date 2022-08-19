import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RateLimiterGuard, RateLimiterModule } from "nestjs-rate-limiter";
import { JwtStrategy } from "../auth/strategies";
import { PhoneOtpModule } from "../phone-otp/phone-otp.module";
import { UsersRepository } from "../users/users.repository";
import { OtpControler } from "./otp.controller";
import { OtpService } from "./otp.service";

@Module({
  imports: [
    PhoneOtpModule,
    RateLimiterModule,
    TypeOrmModule.forFeature([UsersRepository]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: { expiresIn: configService.get("JWT_EXPIRATION_TIME") },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    OtpService,
    {
      provide: APP_GUARD,
      useClass: RateLimiterGuard,
    },
    JwtStrategy,
  ],
  controllers: [OtpControler],
  exports: [OtpService],
})
export class OtpModule {}
