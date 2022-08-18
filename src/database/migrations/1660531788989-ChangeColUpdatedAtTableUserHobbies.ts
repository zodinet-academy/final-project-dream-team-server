import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeColUpdatedAtTableUserHobbies1660531788989
  implements MigrationInterface {
  name = "ChangeColUpdatedAtTableUserHobbies1660531788989";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_hobbies" DROP COLUMN "updated_at"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_hobbies" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_hobbies" DROP COLUMN "updated_at"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_hobbies" ADD "updated_at" character varying NOT NULL`
    );
  }
}
