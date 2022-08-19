import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserLocationsTable1660845627084
  implements MigrationInterface {
  name = "CreateUserLocationsTable1660845627084";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_locations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "latitude" double precision NOT NULL DEFAULT '0', "longtitude" double precision NOT NULL DEFAULT '0', "location" geography(Point,4326), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_437edca703095b237b5bdb35e2" UNIQUE ("user_id"), CONSTRAINT "PK_4afd5dae13173e88183db3cd210" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dd22d2ae2b26a2f233c8e1b859" ON "user_locations" USING GiST ("location") `
    );
    await queryRunner.query(
      `ALTER TABLE "user_locations" ADD CONSTRAINT "FK_437edca703095b237b5bdb35e22" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_locations" DROP CONSTRAINT "FK_437edca703095b237b5bdb35e22"`
    );
    await queryRunner.query(`DROP INDEX "IDX_dd22d2ae2b26a2f233c8e1b859"`);
    await queryRunner.query(`DROP TABLE "user_locations"`);
  }
}
