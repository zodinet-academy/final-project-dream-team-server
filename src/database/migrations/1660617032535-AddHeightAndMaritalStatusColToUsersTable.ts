import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHeightAndMaritalStatusColToUsersTable1660617032535
  implements MigrationInterface {
  name = "AddHeightAndMaritalStatusColToUsersTable1660617032535";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "height" bigint NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "marital_status" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "marital_status"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "height"`);
  }
}
