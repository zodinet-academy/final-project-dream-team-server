import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserBlocksTable1661076544048 implements MigrationInterface {
  name = "CreateUserBlocksTable1661076544048";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_blocks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "blocked_user_id" character varying NOT NULL, CONSTRAINT "PK_0bae5f5cab7574a84889462187c" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "user_blocks" ADD CONSTRAINT "FK_d4abdbd0c82d04db5b237f22658" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_blocks" DROP CONSTRAINT "FK_d4abdbd0c82d04db5b237f22658"`
    );
    await queryRunner.query(`DROP TABLE "user_blocks"`);
  }
}
