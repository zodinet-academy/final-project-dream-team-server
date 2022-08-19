import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteColUrlInUserIamgesTable1660727414425
  implements MigrationInterface {
  name = "DeleteColUrlInUserIamgesTable1660727414425";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_images" DROP COLUMN "url"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_images" ADD "url" character varying NOT NULL`
    );
  }
}
