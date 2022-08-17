import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSettingTable1660638230823 implements MigrationInterface {
  name = "CreateSettingTable1660638230823";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "radius" integer NOT NULL DEFAULT '1', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`COMMENT ON COLUMN "admins"."avatar" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "admins" ALTER COLUMN "avatar" SET DEFAULT null`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admins" ALTER COLUMN "avatar" DROP DEFAULT`
    );
    await queryRunner.query(`COMMENT ON COLUMN "admins"."avatar" IS NULL`);
    await queryRunner.query(`DROP TABLE "settings"`);
  }
}
