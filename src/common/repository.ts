import { DefaultEntity } from "./entity";

export abstract class CommonRepository<TEntity extends DefaultEntity> {
  abstract getById(id: number): Promise<TEntity>;
  abstract getAll(): Promise<TEntity[]>;
}
