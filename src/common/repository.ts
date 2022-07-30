import { DefaultEntity } from "./entity";

export abstract class Repository<TEntity extends DefaultEntity> {
  abstract create(data: TEntity): Promise<TEntity>;
  abstract update(id: number, data: TEntity): Promise<TEntity>;
  abstract getById(id: number): Promise<TEntity>;
  abstract getAll(): Promise<TEntity[]>;
  abstract delete(id: number): Promise<void>;
}
