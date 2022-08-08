import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTableProductImages1659846807091
  implements MigrationInterface {
  name = "RenameTableProductImages1659846807091";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" character varying NOT NULL, "image" character varying NOT NULL, "isDefault" boolean NOT NULL, CONSTRAINT "PK_1974264ea7265989af8392f63a1" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "product_images"`);
  }
}
