import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateColumnInUserLikeStacksTable1661204510911
  implements MigrationInterface {
  name = "UpdateColumnInUserLikeStacksTable1661204510911";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_like_stacks" ADD "is_friend" boolean NOT NULL DEFAULT false`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."gender" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "gender" SET DEFAULT 'OTHER'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "gender" SET DEFAULT 'other'`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."gender" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "user_like_stacks" DROP COLUMN "is_friend"`
    );
  }
}
