import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSystemUsersTable1659975335382 implements MigrationInterface {
  name = "UpdateSystemUsersTable1659975335382";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "system_users" ADD "deleteddAt" TIMESTAMP`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "system_users" DROP COLUMN "deleteddAt"`
    );
  }
}
