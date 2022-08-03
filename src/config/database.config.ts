import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
// file for app
function typeOrmModuleOptions(): TypeOrmModuleOptions {
  const config = new ConfigService();
  return {
    type: "postgres",
    host: config.get("DATABASE_HOST"),
    port: config.get("DATABASE_PORT"),
    username: config.get("DATABASE_USER"),
    password: config.get("DATABASE_PASSWORD"),
    database: config.get("DATABASE_NAME"),
    entities: ["dist/**/**/entities/*.entity{.ts,.js}"],
    autoLoadEntities: true,

    // Implementaremos Migrations.
    /** Recursos
     *  * https://typeorm.io/#/migrations
     */
    migrationsRun: true,
    migrations: [__dirname + "..database/migrations/*{.ts,.js}"],
    migrationsTableName: "migrations_typeorm",
    synchronize: true,
    logging: true,
    logger: "file",
  };
}

export default () => ({
  port: parseInt(process.env.PORT, 10) || 8400,
  database: typeOrmModuleOptions(),
});
