import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./modules/users/users.module";
import * as Joi from "@hapi/joi";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes";
import { AuthModule } from "./modules/auth/auth.module";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import databaseConfig from "./config/database.config";
import { OtpModule } from "./modules/otp/otp.module";
import { MatchingUsersModule } from "./modules/matching-users/matching-users.module";
import { ChatModule } from "./modules/chat/chat.module";

@Module({
  providers: [Logger],
  imports: [
    AuthModule,
    OtpModule,
    UsersModule,
    ChatModule,
    MatchingUsersModule,
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
  ],
})
export class AppModule {}
