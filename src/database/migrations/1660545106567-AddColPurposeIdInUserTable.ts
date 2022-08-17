import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColPurposeIdInUserTable1660545106567
  implements MigrationInterface {
  name = "AddColPurposeIdInUserTable1660545106567";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "purpose_id" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "purpose_id"`);
  }
}
