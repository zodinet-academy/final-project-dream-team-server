import { CommonRepository } from "../../../common/repository";
import { UserBlockEntity } from "../entities/user-block.entity";

export interface IUserBlocksRepository
  extends CommonRepository<UserBlockEntity> {
  pagination: () => void;
}
