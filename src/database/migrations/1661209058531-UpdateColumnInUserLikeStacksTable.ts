import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateColumnInUserLikeStacksTable1661209058531
  implements MigrationInterface {
  name = "UpdateColumnInUserTable1661209058531";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_like_stacks" DROP COLUMN "to_user_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_like_stacks" ADD "to_user_id" uuid NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "user_like_stacks" ADD CONSTRAINT "FK_85d9d160b5b3f0d6187399e66cf" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_like_stacks" DROP CONSTRAINT "FK_85d9d160b5b3f0d6187399e66cf"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_like_stacks" DROP COLUMN "to_user_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_like_stacks" ADD "to_user_id" character varying NOT NULL`
    );
  }
}
