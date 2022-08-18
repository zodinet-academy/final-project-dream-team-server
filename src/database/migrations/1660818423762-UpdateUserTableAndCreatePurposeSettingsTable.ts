import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTableAndCreatePurposeSettingsTable1660818423762
  implements MigrationInterface {
  name = "UpdateUserTableAndCreatePurposeSettingsTable1660818423762";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "purpose-settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "description" character varying(255) NOT NULL, "image" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_7b372954f80db226b37239e6968" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "purpose_id"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "purpose_id" uuid NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_5d1dcff4cf36f110ae9f7e0fb07" FOREIGN KEY ("purpose_id") REFERENCES "purpose-settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_5d1dcff4cf36f110ae9f7e0fb07"`
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "purpose_id"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "purpose_id" character varying NOT NULL`
    );
    await queryRunner.query(`DROP TABLE "purpose-settings"`);
  }
}
