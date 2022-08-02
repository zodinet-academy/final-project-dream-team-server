import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1659410505499 implements MigrationInterface {
  name = "UpdateUserTable1659410505499";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "email" character varying(100) NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."phone" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_a000cca60bcf04454e727699490"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_9117cd802f56e45adfaeb567438" UNIQUE ("phone", "email")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_9117cd802f56e45adfaeb567438"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone")`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."phone" IS NULL`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
  }
}
