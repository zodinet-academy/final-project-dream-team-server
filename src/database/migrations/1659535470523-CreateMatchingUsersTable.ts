import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMatchingUsersTable1659535470523
  implements MigrationInterface {
  name = "CreateMatchingUsersTable1659535470523";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "matching_users" DROP COLUMN "avatar"`
    );
    await queryRunner.query(
      `ALTER TABLE "matching_users" DROP COLUMN "nickname"`
    );
    await queryRunner.query(
      `ALTER TABLE "matching_users" ADD "userId" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "matching_users" ADD "friendId" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "matching_users" DROP COLUMN "friendId"`
    );
    await queryRunner.query(
      `ALTER TABLE "matching_users" DROP COLUMN "userId"`
    );
    await queryRunner.query(
      `ALTER TABLE "matching_users" ADD "nickname" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "matching_users" ADD "avatar" character varying NOT NULL`
    );
  }
}
