import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateColumnGenderColumnInUser1660880764967
  implements MigrationInterface {
  name = "UpdateColumnGenderColumnInUser1660880764967";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "users"."gender" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "gender" SET DEFAULT 'other'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "gender" DROP DEFAULT`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."gender" IS NULL`);
  }
}
