import { CommonRepository } from "../../../common/repository";
import { MatchingUsersEntity } from "../entities/matching-users.entity";

export interface IMatchingUsersRepository
  extends CommonRepository<MatchingUsersEntity> {
  getListFriends(id: string): Promise<string[]>;
}
