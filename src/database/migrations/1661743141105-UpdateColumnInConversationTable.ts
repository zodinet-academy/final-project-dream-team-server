import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateColumnInConversationTable1661743141105
  implements MigrationInterface {
  name = "UpdateColumnInConversationTable1661743141105";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "socket_devices" DROP COLUMN "conversation_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_friends" DROP CONSTRAINT "FK_24f1e41a3801477d44228395e3b"`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user_friends"."friend_id" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "user_friends" DROP CONSTRAINT "REL_24f1e41a3801477d44228395e3"`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_c651a79bf709d5c8dd6095daed6"`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "conversations"."friend_id" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "REL_c651a79bf709d5c8dd6095daed"`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "socket_devices"."user_id" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "socket_devices" ADD CONSTRAINT "UQ_9ca78e06843890ecef35c49db8f" UNIQUE ("user_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_22133395bd13b970ccd0c34ab22" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_friends" ADD CONSTRAINT "FK_24f1e41a3801477d44228395e3b" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_c651a79bf709d5c8dd6095daed6" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "socket_devices" ADD CONSTRAINT "FK_9ca78e06843890ecef35c49db8f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "socket_devices" DROP CONSTRAINT "FK_9ca78e06843890ecef35c49db8f"`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_c651a79bf709d5c8dd6095daed6"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_friends" DROP CONSTRAINT "FK_24f1e41a3801477d44228395e3b"`
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_22133395bd13b970ccd0c34ab22"`
    );
    await queryRunner.query(
      `ALTER TABLE "socket_devices" DROP CONSTRAINT "UQ_9ca78e06843890ecef35c49db8f"`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "socket_devices"."user_id" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "REL_c651a79bf709d5c8dd6095daed" UNIQUE ("friend_id")`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "conversations"."friend_id" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_c651a79bf709d5c8dd6095daed6" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_friends" ADD CONSTRAINT "REL_24f1e41a3801477d44228395e3" UNIQUE ("friend_id")`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user_friends"."friend_id" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "user_friends" ADD CONSTRAINT "FK_24f1e41a3801477d44228395e3b" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "socket_devices" ADD "conversation_id" uuid NOT NULL`
    );
  }
}
