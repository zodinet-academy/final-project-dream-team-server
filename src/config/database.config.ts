import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
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
    migrationsRun: true,
    migrations: [__dirname + "../database/migrations/*{.ts,.js}"],
    migrationsTableName: "migrations",
    synchronize: false,
    logging: true,
    logger: "file",
    namingStrategy: new SnakeNamingStrategy(),
  };
}

export default () => ({
  port: parseInt(process.env.PORT, 10) || 5500,
  database: typeOrmModuleOptions(),
});
