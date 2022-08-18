import { MigrationInterface, QueryRunner } from "typeorm";

export class createConversationAndMessagesAndSocketDevicesAndUserFriendsTable1660818972179
  implements MigrationInterface {
  name =
    "createConversationAndMessagesAndSocketDevicesAndUserFriendsTable1660818972179";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "phone_otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "phone" character varying NOT NULL, "times" integer NOT NULL DEFAULT '0', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9c172907ebe2d49ff32e3007a83" UNIQUE ("phone"), CONSTRAINT "PK_6ba9e3a6f3c60938d59b8ac7f7a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_hobbies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying NOT NULL, "name" character varying NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9f4b5afa1d2484defd6f24d1032" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "purpose_id" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."name" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."email" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."phone" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "description" DROP NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."description" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "children" DROP NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."children" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "alcohol" DROP NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."alcohol" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "religion" DROP NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."religion" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "education" DROP NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."education" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "conversations"."id" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "UQ_ee34f4f7ced4ec8681f26bf04ef" UNIQUE ("id")`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "conversations"."friend_id" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "UQ_c651a79bf709d5c8dd6095daed6" UNIQUE ("friend_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "socket_devices" DROP COLUMN "socket_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "socket_devices" ADD "socket_id" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_c651a79bf709d5c8dd6095daed6" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_ee34f4f7ced4ec8681f26bf04ef" FOREIGN KEY ("id") REFERENCES "messages"("conversation_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_ee34f4f7ced4ec8681f26bf04ef"`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_c651a79bf709d5c8dd6095daed6"`
    );
    await queryRunner.query(
      `ALTER TABLE "socket_devices" DROP COLUMN "socket_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "socket_devices" ADD "socket_id" character varying(50)`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "UQ_c651a79bf709d5c8dd6095daed6"`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "conversations"."friend_id" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "UQ_ee34f4f7ced4ec8681f26bf04ef"`
    );
    await queryRunner.query(`COMMENT ON COLUMN "conversations"."id" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "users"."education" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "education" SET NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."religion" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "religion" SET NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."alcohol" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "alcohol" SET NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."children" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "children" SET NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."description" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "description" SET NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."phone" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "phone" SET NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."email" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."name" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "purpose_id"`);
    await queryRunner.query(`DROP TABLE "user_hobbies"`);
    await queryRunner.query(`DROP TABLE "phone_otp"`);
  }
}
