import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDatabase1660833060796 implements MigrationInterface {
  name = "CreateDatabase1660833060796";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(150) NOT NULL, "email" character varying(150) NOT NULL, "avatar" character varying, "username" character varying(150) NOT NULL, "password" character varying NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "purpose-settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "description" character varying(255) NOT NULL, "image" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_7b372954f80db226b37239e6968" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "avatar" character varying, "name" character varying(255), "email" character varying(100), "phone" character varying(50), "birthday" TIMESTAMP, "gender" character varying(10) NOT NULL, "description" character varying, "children" bigint DEFAULT '0', "alcohol" character varying(15), "religion" character varying(15), "education" character varying(15), "is_block" boolean NOT NULL DEFAULT false, "is_verify" boolean NOT NULL DEFAULT false, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "purpose_id" uuid NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "conversations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "friend_id" uuid NOT NULL, CONSTRAINT "REL_c651a79bf709d5c8dd6095daed" UNIQUE ("friend_id"), CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "sender_id" uuid NOT NULL, "conversation_id" uuid NOT NULL, "content" character varying(150) NOT NULL, "image" character varying(150), CONSTRAINT "REL_3bc55a7c3f9ed54b520bb5cfe2" UNIQUE ("conversation_id"), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "socket_devices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "conversation_id" uuid NOT NULL, "socket_id" character varying NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_31a526f018f451f0684e34516a8" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "phone_otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "phone" character varying NOT NULL, "times" integer NOT NULL DEFAULT '0', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9c172907ebe2d49ff32e3007a83" UNIQUE ("phone"), CONSTRAINT "PK_6ba9e3a6f3c60938d59b8ac7f7a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_friends" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "friend_id" uuid NOT NULL, "status" character varying(150) NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_24f1e41a3801477d44228395e3" UNIQUE ("friend_id"), CONSTRAINT "PK_59c68a26d6f85b8e5df363a0553" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_hobbies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying NOT NULL, "name" character varying NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9f4b5afa1d2484defd6f24d1032" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying NOT NULL, "url" character varying NOT NULL, "cloud_id" character varying NOT NULL, "is_favorite" boolean NOT NULL DEFAULT false, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8c5d93e1b746bef23c0cf9aa3a6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_5d1dcff4cf36f110ae9f7e0fb07" FOREIGN KEY ("purpose_id") REFERENCES "purpose-settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_c651a79bf709d5c8dd6095daed6" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_friends" ADD CONSTRAINT "FK_24f1e41a3801477d44228395e3b" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_friends" DROP CONSTRAINT "FK_24f1e41a3801477d44228395e3b"`
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23"`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_c651a79bf709d5c8dd6095daed6"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_5d1dcff4cf36f110ae9f7e0fb07"`
    );
    await queryRunner.query(`DROP TABLE "user_images"`);
    await queryRunner.query(`DROP TABLE "user_hobbies"`);
    await queryRunner.query(`DROP TABLE "user_friends"`);
    await queryRunner.query(`DROP TABLE "phone_otp"`);
    await queryRunner.query(`DROP TABLE "socket_devices"`);
    await queryRunner.query(`DROP TABLE "messages"`);
    await queryRunner.query(`DROP TABLE "conversations"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "purpose-settings"`);
    await queryRunner.query(`DROP TABLE "admins"`);
  }
}
