import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserFriendsTable1661157591314 implements MigrationInterface {
  name = "UpdateUserFriendsTable1661157591314";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_friends" DROP COLUMN "status"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_friends" ADD "status" character varying(150) NOT NULL`
    );
  }
}
