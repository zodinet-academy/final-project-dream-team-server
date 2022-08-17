import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserImagesTable1660287338815 implements MigrationInterface {
  name = "CreateUserImagesTable1660287338815";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying NOT NULL, "url" character varying NOT NULL, "is_favorite" boolean NOT NULL DEFAULT false, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8c5d93e1b746bef23c0cf9aa3a6" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_images"`);
  }
}
