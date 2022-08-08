import { AutoMap } from "@automapper/classes";
import { IsNotEmpty } from "class-validator";
import { Column, DeleteDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { DefaultEntity } from "../../../common/entity";
import { IProductEntity } from "../interfaces";

@Entity({ name: "products", synchronize: true })
export class ProductEntity extends DefaultEntity implements IProductEntity {
  @Column({ type: "varchar", length: 200 })
  @IsNotEmpty()
  @AutoMap()
  name: string;

  @Column({ type: "double precision", default: 0 })
  @IsNotEmpty()
  @AutoMap()
  price: number;

  @Column({ type: "varchar" })
  @IsNotEmpty()
  @AutoMap()
  description: string;

  @UpdateDateColumn({ name: "updatedAt", type: "timestamp" })
  @AutoMap()
  updatedAt: Date;

  @DeleteDateColumn({ name: "deletedAt", type: "timestamp" })
  @AutoMap()
  deletedAt: Date;
}
