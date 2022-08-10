import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserLocationsTable1660033979184
  implements MigrationInterface {
  name = "UpdateUserLocationsTable1660033979184";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_locations" DROP COLUMN "userId"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_locations" ADD "userId" uuid NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "user_locations" ADD CONSTRAINT "UQ_58343d9d63e326037f304fde3c5" UNIQUE ("userId")`
    );
    await queryRunner.query(
      `ALTER TABLE "user_locations" ADD CONSTRAINT "FK_58343d9d63e326037f304fde3c5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_locations" DROP CONSTRAINT "FK_58343d9d63e326037f304fde3c5"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_locations" DROP CONSTRAINT "UQ_58343d9d63e326037f304fde3c5"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_locations" DROP COLUMN "userId"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_locations" ADD "userId" character varying NOT NULL`
    );
  }
}
