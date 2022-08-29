import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeleteColInUserEntity1661786889542
  implements MigrationInterface {
  name = "AddDeleteColInUserEntity1661786889542";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
  }
}
