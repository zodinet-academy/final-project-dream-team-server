import { MigrationInterface, QueryRunner } from "typeorm";

export class fixSocketDeviceTable1661339439092 implements MigrationInterface {
  name = "fixSocketDeviceTable1661339439092";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_5d1dcff4cf36f110ae9f7e0fb07"`
    );
    await queryRunner.query(
      `CREATE TABLE "user_blocks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "blocked_user_id" uuid NOT NULL, CONSTRAINT "PK_0bae5f5cab7574a84889462187c" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "purpose_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "description" character varying(255) NOT NULL, "image" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_e3d71e9b2cdbed6c14d9d01c43f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_like_stacks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "from_user_id" uuid NOT NULL, "to_user_id" uuid NOT NULL, "is_friend" boolean NOT NULL DEFAULT false, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_28412563b70120fbd427261085e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "message" character varying NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "receiver_id" uuid NOT NULL, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "user_friends" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "user_hobbies" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_hobbies" ADD "user_id" uuid NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "user_images" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_images" ADD "user_id" uuid NOT NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "conversations"."user_id" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "UQ_3a9ae579e61e81cc0e989afeb4a" UNIQUE ("user_id")`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "socket_devices"."user_id" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "socket_devices" DROP CONSTRAINT "PK_e4f3e3531bde7c6a24170ba99a9"`
    );
    await queryRunner.query(
      `ALTER TABLE "socket_devices" ADD CONSTRAINT "PK_31a526f018f451f0684e34516a8" PRIMARY KEY ("id")`
    );
    await queryRunner.query(
      `ALTER TABLE "socket_devices" ADD CONSTRAINT "UQ_9ca78e06843890ecef35c49db8f" UNIQUE ("user_id")`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user_friends"."user_id" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "user_friends" ADD CONSTRAINT "UQ_73aac2cba30951ed7c7000c6142" UNIQUE ("user_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "user_blocks" ADD CONSTRAINT "FK_d4abdbd0c82d04db5b237f22658" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_like_stacks" ADD CONSTRAINT "FK_8490cfe0c96db679ede54797ce9" FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_like_stacks" ADD CONSTRAINT "FK_85d9d160b5b3f0d6187399e66cf" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_hobbies" ADD CONSTRAINT "FK_3d8a2d6d51c448b8fe5b12570ef" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_images" ADD CONSTRAINT "FK_1f838530159ac83c30cab951dca" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_5d1dcff4cf36f110ae9f7e0fb07" FOREIGN KEY ("purpose_id") REFERENCES "purpose_settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_3a9ae579e61e81cc0e989afeb4a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_343c8ee2cd2f4036f2a3423989e" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_friends" ADD CONSTRAINT "FK_73aac2cba30951ed7c7000c6142" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_friends" DROP CONSTRAINT "FK_73aac2cba30951ed7c7000c6142"`
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_343c8ee2cd2f4036f2a3423989e"`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_3a9ae579e61e81cc0e989afeb4a"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_5d1dcff4cf36f110ae9f7e0fb07"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_images" DROP CONSTRAINT "FK_1f838530159ac83c30cab951dca"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_hobbies" DROP CONSTRAINT "FK_3d8a2d6d51c448b8fe5b12570ef"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_like_stacks" DROP CONSTRAINT "FK_85d9d160b5b3f0d6187399e66cf"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_like_stacks" DROP CONSTRAINT "FK_8490cfe0c96db679ede54797ce9"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_blocks" DROP CONSTRAINT "FK_d4abdbd0c82d04db5b237f22658"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_friends" DROP CONSTRAINT "UQ_73aac2cba30951ed7c7000c6142"`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user_friends"."user_id" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "socket_devices" DROP CONSTRAINT "UQ_9ca78e06843890ecef35c49db8f"`
    );
    await queryRunner.query(
      `ALTER TABLE "socket_devices" DROP CONSTRAINT "PK_31a526f018f451f0684e34516a8"`
    );
    await queryRunner.query(
      `ALTER TABLE "socket_devices" ADD CONSTRAINT "PK_e4f3e3531bde7c6a24170ba99a9" PRIMARY KEY ("id", "user_id")`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "socket_devices"."user_id" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "UQ_3a9ae579e61e81cc0e989afeb4a"`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "conversations"."user_id" IS NULL`
    );
    await queryRunner.query(`ALTER TABLE "user_images" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_images" ADD "user_id" character varying NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "user_hobbies" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_hobbies" ADD "user_id" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "user_friends" ADD "status" character varying(150) NOT NULL`
    );
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "user_like_stacks"`);
    await queryRunner.query(`DROP TABLE "purpose_settings"`);
    await queryRunner.query(`DROP TABLE "user_blocks"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_5d1dcff4cf36f110ae9f7e0fb07" FOREIGN KEY ("purpose_id") REFERENCES "purpose-settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
