import { MigrationInterface, QueryRunner } from "typeorm";

export class fixSocketDeviceTable1661412200162 implements MigrationInterface {
  name = "fixSocketDeviceTable1661412200162";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_friends" DROP CONSTRAINT "FK_24f1e41a3801477d44228395e3b"`
    );
    // await queryRunner.query(
    //   `ALTER TABLE "user_friends" DROP CONSTRAINT "FK_73aac2cba30951ed7c7000c6142"`
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "conversations" DROP CONSTRAINT "FK_3a9ae579e61e81cc0e989afeb4a"`
    // );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_c651a79bf709d5c8dd6095daed6"`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "conversations"."user_id" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "UQ_3a9ae579e61e81cc0e989afeb4a" UNIQUE ("user_id")`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "conversations"."friend_id" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "UQ_c651a79bf709d5c8dd6095daed6" UNIQUE ("friend_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_c651a79bf709d5c8dd6095daed6" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_3a9ae579e61e81cc0e989afeb4a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_3a9ae579e61e81cc0e989afeb4a"`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_c651a79bf709d5c8dd6095daed6"`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "UQ_c651a79bf709d5c8dd6095daed6"`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "conversations"."friend_id" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "UQ_3a9ae579e61e81cc0e989afeb4a"`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "conversations"."user_id" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_c651a79bf709d5c8dd6095daed6" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_3a9ae579e61e81cc0e989afeb4a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_friends" ADD CONSTRAINT "FK_73aac2cba30951ed7c7000c6142" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_friends" ADD CONSTRAINT "FK_24f1e41a3801477d44228395e3b" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
