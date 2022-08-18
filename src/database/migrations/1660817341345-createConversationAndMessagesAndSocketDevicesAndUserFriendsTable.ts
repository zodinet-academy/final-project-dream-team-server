import { MigrationInterface, QueryRunner } from "typeorm";

export class createConversationAndMessagesAndSocketDevicesAndUserFriendsTable1660817341345
  implements MigrationInterface {
  name =
    "createConversationAndMessagesAndSocketDevicesAndUserFriendsTable1660817341345";

  public async up(queryRunner: QueryRunner): Promise<void> {
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
  }
}
