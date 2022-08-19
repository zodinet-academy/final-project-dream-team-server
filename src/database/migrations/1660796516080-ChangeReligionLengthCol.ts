import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeReligionLengthCol1660796516080
  implements MigrationInterface {
  name = "ChangeReligionLengthCol1660796516080";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "alcohol"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "alcohol" character varying(20) NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "religion"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "religion" character varying NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "education"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "education" character varying(20) NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "education"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "education" character varying(10) NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "religion"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "religion" character varying(10) NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "alcohol"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "alcohol" character varying(10) NOT NULL`
    );
  }
}
