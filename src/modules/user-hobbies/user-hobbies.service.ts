import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { GetUserHobbiesDto } from "./dto";
import { UserHobbyEntity } from "./entities/user-hobbies.entity";
import { IUserHobbiesService } from "./interfaces";
import { UserHobbiesRepository } from "./user-hobbies.repository";

@Injectable()
export class UserHobbiesService implements IUserHobbiesService {
  constructor(
    private readonly userHobbiesRepository: UserHobbiesRepository,
    @InjectMapper() private readonly mapper: Mapper
  ) {}

  async getUserHobbies(userId: string): Promise<GetUserHobbiesDto[]> {
    const hobbies = await this.userHobbiesRepository.find({ userId: userId });
    if (!hobbies) return undefined;

    const userHobbies = this.mapper.mapArray(
      hobbies,
      UserHobbyEntity,
      GetUserHobbiesDto
    );

    return userHobbies;
  }
}
