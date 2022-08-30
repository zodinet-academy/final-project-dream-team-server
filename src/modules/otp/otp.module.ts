import { HttpModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SocialGuard } from "../auth/guards/social.guard";
import { JwtStrategy } from "../auth/strategies";
import { PhoneOtpModule } from "../phone-otp/phone-otp.module";
import { UsersRepository } from "../users/users.repository";
import { OtpControler } from "./otp.controller";
import { OtpService } from "./otp.service";

@Module({
  imports: [
    PhoneOtpModule,
    HttpModule,
    // RateLimiterModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: { expiresIn: configService.get("JWT_EXPIRATION_TIME") },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UsersRepository]),
  ],
  providers: [
    OtpService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RateLimiterGuard,
    // },
    JwtStrategy,
    SocialGuard,
  ],
  controllers: [OtpControler],
  exports: [OtpService],
})
export class OtpModule {}
