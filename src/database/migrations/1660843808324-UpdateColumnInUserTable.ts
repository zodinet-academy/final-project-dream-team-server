import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateColumnInUserTable1660843808324
  implements MigrationInterface {
  name = "UpdateColumnInUserTable1660843808324";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "marital_status" DROP NOT NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."marital_status" IS NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."marital_status" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "marital_status" SET NOT NULL`
    );
  }
}
