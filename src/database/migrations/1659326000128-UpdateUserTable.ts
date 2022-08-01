import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1659326000128 implements MigrationInterface {
  name = "UpdateUserTable1659326000128";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "avatar" DROP NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."avatar" IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "users"."avatar" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "avatar" SET NOT NULL`
    );
  }
}
