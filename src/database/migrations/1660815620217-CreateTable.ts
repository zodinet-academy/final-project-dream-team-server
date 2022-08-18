import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1660815620217 implements MigrationInterface {
  name = "CreateTable1660815620217";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(150) NOT NULL, "email" character varying(150) NOT NULL, "avatar" character varying NOT NULL, "username" character varying(150) NOT NULL, "password" character varying NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "conversations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying(150) NOT NULL, "friend_id" character varying(150) NOT NULL, CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "sender_id" character varying(150) NOT NULL, "conversation_id" character varying(150) NOT NULL, "content" character varying(150) NOT NULL, "image" character varying(150) NOT NULL, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "socket_devices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying(150) NOT NULL, "conversation_id" character varying(150) NOT NULL, "socket_id" character varying(150) NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_31a526f018f451f0684e34516a8" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "phone_otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "phone" character varying NOT NULL, "times" integer NOT NULL DEFAULT '0', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9c172907ebe2d49ff32e3007a83" UNIQUE ("phone"), CONSTRAINT "PK_6ba9e3a6f3c60938d59b8ac7f7a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_hobbies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying NOT NULL, "name" character varying NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9f4b5afa1d2484defd6f24d1032" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "avatar" character varying, "name" character varying(255), "email" character varying(100), "phone" character varying(50), "birthday" TIMESTAMP, "purpose_id" character varying NOT NULL, "gender" character varying(10) NOT NULL, "description" character varying, "children" bigint DEFAULT '0', "alcohol" character varying(10), "religion" character varying(10), "height" bigint NOT NULL DEFAULT '0', "marital_status" character varying NOT NULL, "education" character varying(10) NOT NULL, "is_block" boolean NOT NULL DEFAULT false, "is_verify" boolean NOT NULL DEFAULT false, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "user_hobbies"`);
    await queryRunner.query(`DROP TABLE "phone_otp"`);
    await queryRunner.query(`DROP TABLE "socket_devices"`);
    await queryRunner.query(`DROP TABLE "messages"`);
    await queryRunner.query(`DROP TABLE "conversations"`);
    await queryRunner.query(`DROP TABLE "admins"`);
  }
}
