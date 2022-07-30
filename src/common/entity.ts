import { IsNotEmpty } from "class-validator";
import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { AutoMap } from "@automapper/classes";

export abstract class DefaultEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @IsNotEmpty()
  @AutoMap()
  id: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;
}
