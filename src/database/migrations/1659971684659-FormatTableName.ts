import { MigrationInterface, QueryRunner } from "typeorm";

export class FormatTableName1659971684659 implements MigrationInterface {
  name = "FormatTableName1659971684659";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "matchingUsers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" character varying NOT NULL, "friendId" character varying NOT NULL, CONSTRAINT "PK_5a4425a143b0be0ed47060c2505" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "phoneOtp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "phone" character varying NOT NULL, "times" integer NOT NULL DEFAULT '0', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2af8500ec7f0faf82c92c5b24b7" UNIQUE ("phone"), CONSTRAINT "PK_0c619339b2b27081fcd31cd3529" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "productImages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" character varying NOT NULL, "image" character varying NOT NULL, "publicId" character varying NOT NULL, "isDefault" boolean NOT NULL, CONSTRAINT "PK_265744321363f94f5789402b70c" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "productImages"`);
    await queryRunner.query(`DROP TABLE "phoneOtp"`);
    await queryRunner.query(`DROP TABLE "matchingUsers"`);
  }
}
