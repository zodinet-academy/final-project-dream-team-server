import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserLocationsTable1660038679044
  implements MigrationInterface {
  name = "UpdateUserLocationsTable1660038679044";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_locations" DROP COLUMN "lng"`);
    await queryRunner.query(
      `ALTER TABLE "user_locations" ADD "long" double precision NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE "user_locations" ADD "location" geography(Point,4326)`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dd22d2ae2b26a2f233c8e1b859" ON "user_locations" USING GiST ("location") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_dd22d2ae2b26a2f233c8e1b859"`);
    await queryRunner.query(
      `ALTER TABLE "user_locations" DROP COLUMN "location"`
    );
    await queryRunner.query(`ALTER TABLE "user_locations" DROP COLUMN "long"`);
    await queryRunner.query(
      `ALTER TABLE "user_locations" ADD "lng" double precision NOT NULL DEFAULT '0'`
    );
  }
}
