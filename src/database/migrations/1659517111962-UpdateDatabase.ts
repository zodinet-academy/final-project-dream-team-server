import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDatabase1659517111962 implements MigrationInterface {
  name = "UpdateDatabase1659517111962";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "phone_otp" RENAME COLUMN "created_at" TO "createdAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "created_at" TO "createdAt"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at"`
    );
    await queryRunner.query(
      `ALTER TABLE "phone_otp" RENAME COLUMN "createdAt" TO "created_at"`
    );
  }
}
