import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserLocationTable1660842057251
  implements MigrationInterface {
  name = "CreateUserLocationTable1660842057251";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "radius" integer NOT NULL DEFAULT '1', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "height" bigint NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "marital_status" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "marital_status"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "height"`);
    await queryRunner.query(`DROP TABLE "settings"`);
  }
}
