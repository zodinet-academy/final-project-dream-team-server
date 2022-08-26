import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFieldsInUserAndUserImage1660877811174
  implements MigrationInterface {
  name = "UpdateFieldsInUserAndUserImage1660877811174";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_images" DROP COLUMN "url"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_images" ADD "url" character varying NOT NULL`
    );
  }
}
