import { OtpModule } from "./../otp/otp.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PublicUsersController } from "./public-users.controller";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";
import { MatchingUsersModule } from "../matching-users/matching-users.module";
import { UserProfile } from "./user.profile";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserImagesModule } from "../user-images/user-images.module";
import { UserHobbiesModule } from "../user-hobbies/user-hobbies.module";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { AdminUsersController } from "./admin-users.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRepository]),
    OtpModule,
    MatchingUsersModule,
    UserImagesModule,
    UserHobbiesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: { expiresIn: configService.get("JWT_EXPIRATION_TIME") },
      }),
      inject: [ConfigService],
    }),
    CloudinaryModule,
  ],
  controllers: [PublicUsersController, UsersController, AdminUsersController],
  providers: [UsersService, UserProfile],
  exports: [UsersService],
})
export class UsersModule {}
