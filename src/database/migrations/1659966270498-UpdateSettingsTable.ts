import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSettingsTable1659966270498 implements MigrationInterface {
  name = "UpdateSettingsTable1659966270498";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "radius"`);
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "radius" integer NOT NULL DEFAULT '1'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "radius"`);
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "radius" bigint NOT NULL DEFAULT '1'`
    );
  }
}
