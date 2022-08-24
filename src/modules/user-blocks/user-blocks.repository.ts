import { IUserBlocksRepository } from "./interfaces/user-blocks-repository.interface";
import { EntityRepository, Repository } from "typeorm";
import { UserBlockEntity } from "./entities/user-block.entity";

@EntityRepository(UserBlockEntity)
export class UserBlocksRepository
  extends Repository<UserBlockEntity>
  implements IUserBlocksRepository {
  pagination: () => void;
  getById(): Promise<UserBlockEntity> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<UserBlockEntity[]> {
    throw new Error("Method not implemented.");
  }
}
