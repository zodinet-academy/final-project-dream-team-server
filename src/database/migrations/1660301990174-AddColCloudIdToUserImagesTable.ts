import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColCloudIdToUserImagesTable1660301990174
  implements MigrationInterface {
  name = "AddColCloudIdToUserImagesTable1660301990174";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_images" ADD "cloud_id" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_images" DROP COLUMN "cloud_id"`);
  }
}
