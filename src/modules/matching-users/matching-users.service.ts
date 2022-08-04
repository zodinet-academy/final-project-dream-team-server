import { Injectable } from "@nestjs/common";
import { IMatchingUsersService } from "./interfaces";
import { MatchingUsersRepository } from "./matching-users.repository";

@Injectable()
export class MatchingUsersService implements IMatchingUsersService {
  constructor(private matchingUsersRepository: MatchingUsersRepository) {}

  async getListFriendsId(id: string): Promise<string[]> {
    const result = await this.matchingUsersRepository.getListFriends(id);
    return result;
  }
}
