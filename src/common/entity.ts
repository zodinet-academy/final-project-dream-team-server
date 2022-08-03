import { IsNotEmpty } from "class-validator";
import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export abstract class DefaultEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @IsNotEmpty()
  id: string;

  @CreateDateColumn({ name: "createdAt", type: "timestamp" })
  createdAt: Date;
}
