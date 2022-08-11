import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAdminsAndUserTable1660215447110
  implements MigrationInterface {
  name = "CreateAdminsAndUserTable1660215447110";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(150) NOT NULL, "email" character varying(150) NOT NULL, "avatar" character varying NOT NULL, "username" character varying(150) NOT NULL, "password" character varying NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "avatar" character varying, "name" character varying(255) NOT NULL, "email" character varying(100) NOT NULL, "phone" character varying(50) NOT NULL, "birthday" TIMESTAMP, "gender" character varying(10) NOT NULL, "description" character varying NOT NULL, "children" bigint NOT NULL DEFAULT '0', "alcohol" character varying(10) NOT NULL, "religion" character varying(10) NOT NULL, "education" character varying(10) NOT NULL, "isBlock" boolean NOT NULL DEFAULT false, "isVerify" boolean NOT NULL DEFAULT false, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "admins"`);
  }
}
