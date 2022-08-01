import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1659269237806 implements MigrationInterface {
  name = "CreateUsersTable1659269237806";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "avatar" character varying NOT NULL, "nickname" character varying(150) NOT NULL, "fullname" character varying(150) NOT NULL, "phone" character varying(50) NOT NULL, "gender" character varying(10) NOT NULL, "is_block" boolean NOT NULL, "balance" bigint NOT NULL, "lat" double precision NOT NULL, "lng" double precision NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
