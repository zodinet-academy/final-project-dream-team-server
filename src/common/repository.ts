import { Order } from "../constants/enum";
import { DefaultEntity } from "./entity";

export abstract class CommonRepository<TEntity extends DefaultEntity> {
  abstract getById(id: number): Promise<TEntity>;
  abstract getAll(order: Order, page: number, limit: number): Promise<any>;
}
