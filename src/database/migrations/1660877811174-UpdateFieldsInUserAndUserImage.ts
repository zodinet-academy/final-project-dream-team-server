import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFieldsInUserAndUserImage1660877811174
  implements MigrationInterface {
  name = "UpdateFieldsInUserAndUserImage1660877811174";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_images" DROP COLUMN "url"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "height" bigint NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "marital_status" character varying NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "education"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "education" character varying(20) NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "education"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "education" character varying(15)`
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "marital_status"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "height"`);
    await queryRunner.query(
      `ALTER TABLE "user_images" ADD "url" character varying NOT NULL`
    );
  }
}
