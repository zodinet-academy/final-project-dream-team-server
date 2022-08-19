import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateColumnPurposeColumnInUser1660881394098
  implements MigrationInterface {
  name = "UpdateColumnPurposeColumnInUser1660881394098";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_5d1dcff4cf36f110ae9f7e0fb07"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "purpose_id" DROP NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."purpose_id" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_5d1dcff4cf36f110ae9f7e0fb07" FOREIGN KEY ("purpose_id") REFERENCES "purpose-settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_5d1dcff4cf36f110ae9f7e0fb07"`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."purpose_id" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "purpose_id" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_5d1dcff4cf36f110ae9f7e0fb07" FOREIGN KEY ("purpose_id") REFERENCES "purpose-settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
