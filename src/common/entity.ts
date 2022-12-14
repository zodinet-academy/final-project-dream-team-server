import { AutoMap } from "@automapper/classes";
import { IsNotEmpty } from "class-validator";
import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export abstract class DefaultEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @IsNotEmpty()
  @AutoMap()
  id: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  @AutoMap()
  createdAt: Date;
}
