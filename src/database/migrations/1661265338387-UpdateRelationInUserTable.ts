import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRelationInUserTable1661265338387
  implements MigrationInterface {
  name = "UpdateRelationInUserTable1661265338387";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_images" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_images" ADD "user_id" uuid NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."gender" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "gender" SET DEFAULT 'other'`
    );
    await queryRunner.query(
      `ALTER TABLE "user_images" ADD CONSTRAINT "FK_1f838530159ac83c30cab951dca" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_images" DROP CONSTRAINT "FK_1f838530159ac83c30cab951dca"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "gender" SET DEFAULT 'OTHER'`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."gender" IS NULL`);
    await queryRunner.query(`ALTER TABLE "user_images" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_images" ADD "user_id" character varying NOT NULL`
    );
  }
}
