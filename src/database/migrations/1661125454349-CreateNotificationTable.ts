import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotificationTable1661125454349
  implements MigrationInterface {
  name = "CreateNotificationTable1661125454349";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_5d1dcff4cf36f110ae9f7e0fb07"`
    );
    await queryRunner.query(
      `CREATE TABLE "purpose_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "description" character varying(255) NOT NULL, "image" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_e3d71e9b2cdbed6c14d9d01c43f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "message" character varying NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "receiver_id" uuid NOT NULL, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_5d1dcff4cf36f110ae9f7e0fb07" FOREIGN KEY ("purpose_id") REFERENCES "purpose_settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_343c8ee2cd2f4036f2a3423989e" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(`DROP TABLE "purpose-settings"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_343c8ee2cd2f4036f2a3423989e"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_5d1dcff4cf36f110ae9f7e0fb07"`
    );
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "purpose_settings"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_5d1dcff4cf36f110ae9f7e0fb07" FOREIGN KEY ("purpose_id") REFERENCES "purpose-settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
