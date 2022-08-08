import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSystemUsersTable1659972162365 implements MigrationInterface {
  name = "CreateSystemUsersTable1659972162365";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "system_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying(150) NOT NULL, "password" character varying NOT NULL, "email" character varying(150) NOT NULL, "phone" character varying NOT NULL, "gender" character varying(10) NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cd8917a46de98ec75f9197911c0" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `INSERT INTO "system_users" ("username", "password", "email", "phone", "gender") values ('admin', '$2b$10$Ntu6.UKlIFJA18m2KZ1PeeH9UXRZjaZF2KK3/tec1vbroNCpx//pO', 'admin@gmail.com', '123456', 'male');`
    );
    // password: 123456
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "system_users"`);
  }
}
