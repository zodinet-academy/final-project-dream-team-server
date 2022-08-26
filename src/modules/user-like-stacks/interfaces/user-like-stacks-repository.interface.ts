import { CommonRepository } from "../../../common/repository";
import { UserLikeStackEntity } from "../entities/user-like-stack.entity";

export interface IUserLikeStacksRepository
  extends CommonRepository<UserLikeStackEntity> {
  getListFriends(id: string): Promise<string[]>;
}
