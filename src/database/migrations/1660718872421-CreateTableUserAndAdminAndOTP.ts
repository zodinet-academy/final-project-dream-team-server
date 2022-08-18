import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUserAndAdminAndOTP1660718872421
  implements MigrationInterface {
  name = "CreateTableUserAndAdminAndOTP1660718872421";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(150) NOT NULL, "email" character varying(150) NOT NULL, "avatar" character varying NOT NULL, "username" character varying(150) NOT NULL, "password" character varying NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "phone_otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "phone" character varying NOT NULL, "times" integer NOT NULL DEFAULT '0', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9c172907ebe2d49ff32e3007a83" UNIQUE ("phone"), CONSTRAINT "PK_6ba9e3a6f3c60938d59b8ac7f7a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "avatar" character varying, "name" character varying(255), "email" character varying(100), "phone" character varying(50), "birthday" TIMESTAMP, "gender" character varying(10), "description" character varying, "children" bigint DEFAULT '0', "alcohol" character varying(10), "religion" character varying(10), "education" character varying(10), "is_block" boolean NOT NULL DEFAULT false, "role" character varying NOT NULL DEFAULT 'user', "is_verify" boolean NOT NULL DEFAULT false, "update_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "phone_otp"`);
    await queryRunner.query(`DROP TABLE "admins"`);
  }
}
