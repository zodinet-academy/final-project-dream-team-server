import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserLikeStacksTable1661099711057
  implements MigrationInterface {
  name = "CreateUserLikeStacksTable1661099711057";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_like_stacks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "from_user_id" uuid NOT NULL, "to_user_id" character varying NOT NULL, CONSTRAINT "PK_28412563b70120fbd427261085e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "user_like_stacks" ADD CONSTRAINT "FK_8490cfe0c96db679ede54797ce9" FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_like_stacks" DROP CONSTRAINT "FK_8490cfe0c96db679ede54797ce9"`
    );
    await queryRunner.query(`DROP TABLE "user_like_stacks"`);
  }
}
