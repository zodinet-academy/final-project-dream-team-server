import { MigrationInterface, QueryRunner } from "typeorm";

export class createConversationAndMessagesAndSocketDevicesAndUserFriendsTable1660839231618
  implements MigrationInterface {
  name =
    "createConversationAndMessagesAndSocketDevicesAndUserFriendsTable1660839231618";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23"`
    );
  }
}
