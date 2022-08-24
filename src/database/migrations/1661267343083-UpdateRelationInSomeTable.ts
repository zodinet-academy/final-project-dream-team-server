import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRelationInSomeTable1661267343083
  implements MigrationInterface {
  name = "UpdateRelationInSomeTable1661267343083";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_blocks" DROP COLUMN "blocked_user_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_blocks" ADD "blocked_user_id" uuid NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "user_hobbies" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_hobbies" ADD "user_id" uuid NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "user_hobbies" ADD CONSTRAINT "FK_3d8a2d6d51c448b8fe5b12570ef" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_hobbies" DROP CONSTRAINT "FK_3d8a2d6d51c448b8fe5b12570ef"`
    );
    await queryRunner.query(`ALTER TABLE "user_hobbies" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_hobbies" ADD "user_id" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "user_blocks" DROP COLUMN "blocked_user_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_blocks" ADD "blocked_user_id" character varying NOT NULL`
    );
  }
}
