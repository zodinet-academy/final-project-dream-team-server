import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateColumnInUserLikeStacksTable1661212656820
  implements MigrationInterface {
  name = "UpdateColumnInUserLikeStacksTable1661212656820";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_like_stacks" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_like_stacks" DROP COLUMN "updated_at"`
    );
  }
}
