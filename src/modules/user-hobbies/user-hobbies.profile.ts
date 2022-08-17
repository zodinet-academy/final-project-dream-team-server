import { createMap, Mapper, MappingProfile } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { GetUserHobbiesDto } from "./dto";
import { UserHobbyEntity } from "./entities/user-hobbies.entity";

@Injectable()
export class UserHobbiesProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, UserHobbyEntity, GetUserHobbiesDto);
    };
  }
}
