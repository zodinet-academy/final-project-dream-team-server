import { MigrationInterface, QueryRunner } from "typeorm";

export class createConversationAndMessagesAndSocketDevicesAndUserFriendsTable1660838487920
  implements MigrationInterface {
  name =
    "createConversationAndMessagesAndSocketDevicesAndUserFriendsTable1660838487920";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23"`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "messages"."conversation_id" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "REL_3bc55a7c3f9ed54b520bb5cfe2"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "REL_3bc55a7c3f9ed54b520bb5cfe2" UNIQUE ("conversation_id")`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "messages"."conversation_id" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
