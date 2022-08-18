import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserHobbiesTable1660531326853 implements MigrationInterface {
  name = "CreateUserHobbiesTable1660531326853";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_hobbies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying NOT NULL, "name" character varying NOT NULL, "updated_at" character varying NOT NULL, CONSTRAINT "PK_9f4b5afa1d2484defd6f24d1032" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_hobbies"`);
  }
}
