import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePhoneOtpTable1659452850018 implements MigrationInterface {
  name = "CreatePhoneOtpTable1659452850018";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "phone_otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "phone" character varying NOT NULL, "times" integer NOT NULL DEFAULT '0', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9c172907ebe2d49ff32e3007a83" UNIQUE ("phone"), CONSTRAINT "PK_6ba9e3a6f3c60938d59b8ac7f7a" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "phone_otp"`);
  }
}
