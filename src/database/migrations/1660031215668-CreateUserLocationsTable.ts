import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserLocationsTable1660031215668
  implements MigrationInterface {
  name = "CreateUserLocationsTable1660031215668";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_locations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" character varying NOT NULL, "lat" double precision NOT NULL DEFAULT '0', "lng" double precision NOT NULL DEFAULT '0', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4afd5dae13173e88183db3cd210" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lat"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lng"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "lng" double precision NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "lat" double precision NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(`DROP TABLE "user_locations"`);
  }
}
