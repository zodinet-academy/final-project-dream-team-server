import { classes } from "@automapper/classes";
import { Logger, Module } from "@nestjs/common";
import { AutomapperModule } from "@automapper/nestjs";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

import * as Joi from "joi";
import databaseConfig from "./config/database.config";

import { OtpModule } from "./modules/otp/otp.module";
import { ChatModule } from "./modules/chat/chat.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { SettingsModule } from "./modules/settings/settings.module";
import { MatchingUsersModule } from "./modules/matching-users/matching-users.module";
import { UserLocationsModule } from "./modules/user-locations/user-locations.module";
import { CloudinaryModule } from "./modules/cloudinary/cloudinary.module";
import { AdminsModule } from "./modules/admins/admins.module";
import { UserImagesModule } from "./modules/user-images/user-images.module";
import { UserHobbiesModule } from "./modules/user-hobbies/user-hobbies.module";

@Module({
  providers: [Logger],
  imports: [
    UsersModule,
    AuthModule,
    OtpModule,
    AuthModule,
    MatchingUsersModule,
    AdminsModule,
    UserImagesModule,
    UserHobbiesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: `env/.env.${process.env.NODE_ENV || "local"}`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid("local", "development", "production")
          .default("local"),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) =>
        config.get<TypeOrmModuleOptions>("database"),
      inject: [ConfigService],
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) =>
        config.get<TypeOrmModuleOptions>("database"),
      inject: [ConfigService],
    }),
    SettingsModule,
    AdminsModule,
    UserLocationsModule,
    CloudinaryModule,
    ChatModule,
  ],
})
export class AppModule {}
