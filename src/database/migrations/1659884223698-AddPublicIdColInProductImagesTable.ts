import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPublicIdColInProductImagesTable1659884223698
  implements MigrationInterface {
  name = "AddPublicIdColInProductImagesTable1659884223698";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_images" ADD "publicId" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_images" DROP COLUMN "publicId"`
    );
  }
}
