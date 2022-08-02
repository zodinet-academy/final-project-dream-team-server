import { IsNotEmpty } from "class-validator";
import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export abstract class DefaultEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @IsNotEmpty()
  id: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;
}
