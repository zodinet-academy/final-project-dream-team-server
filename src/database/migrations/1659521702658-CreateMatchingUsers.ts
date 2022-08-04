import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMatchingUsers1659521702658 implements MigrationInterface {
  name = "CreateMatchingUsers1659521702658";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "matching_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "avatar" character varying NOT NULL, "nickname" character varying NOT NULL, CONSTRAINT "PK_e241a2d3a340b0b2e432d83bbae" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "matching_users"`);
  }
}
