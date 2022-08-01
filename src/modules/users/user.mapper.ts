import {
  createMap,
  forMember,
  ignore,
  Mapper,
  MappingProfile,
} from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserEntity } from "./entities/user.entity";

export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, UserEntity, CreateUserDto);
      createMap(
        mapper,
        CreateUserDto,
        UserEntity,
        forMember((dest) => dest.id, ignore())
      );
      createMap(mapper, UpdateUserDto, UserEntity);
    };
  }
}
