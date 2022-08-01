import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUsersTable1659281290155 implements MigrationInterface {
  name = "UpdateUsersTable1659281290155";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "users"."is_block" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "is_block" SET DEFAULT false`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."balance" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "balance" SET DEFAULT '0'`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."lat" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "lat" SET DEFAULT '0'`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."lng" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "lng" SET DEFAULT '0'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "lng" DROP DEFAULT`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."lng" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "lat" DROP DEFAULT`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."lat" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "balance" DROP DEFAULT`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."balance" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "is_block" DROP DEFAULT`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."is_block" IS NULL`);
  }
}
