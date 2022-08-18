import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAdminTable1660817451054 implements MigrationInterface {
  name = "UpdateAdminTable1660817451054";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admins" ALTER COLUMN "avatar" DROP NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "admins"."avatar" IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "admins"."avatar" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "admins" ALTER COLUMN "avatar" SET NOT NULL`
    );
  }
}
