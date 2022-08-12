import * as dotenv from "dotenv";
import { ConnectionOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
// file for migration
dotenv.config({
  path: `env/.env.local`,
});

export = {
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  migrationsRun: true,
  logging: false,
  entities: [
    "src/**/**/entities/*.entity{.ts,.js}",
    "src/**/**/*.entity{.ts,.js}",
  ],
  migrations: ["src/database/migrations/*{.ts,.js}"],
  cli: {
    migrationsDir: "src/database/migrations",
  },
  namingStrategy: new SnakeNamingStrategy(),
} as ConnectionOptions;
