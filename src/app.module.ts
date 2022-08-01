import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./modules/users/users.module";
import * as Joi from "@hapi/joi";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes";
import { OtpModule } from "./modules/otp/otp.module";

@Module({
  providers: [Logger],
  imports: [
    UsersModule,
    OtpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env/.env.${process.env.NODE_ENV || "local"}`, // .env.development
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid("local", "development", "production")
          .default("local"),
      }),
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
})
export class AppModule {}
