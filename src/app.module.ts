import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./modules/users/users.module";
import * as Joi from "@hapi/joi";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
  providers: [Logger],
  imports: [
    // UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env/.env.${process.env.NODE_ENV || "local"}`,
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
