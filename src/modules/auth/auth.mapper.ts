import {
  createMap,
  forMember,
  ignore,
  Mapper,
  MappingProfile,
} from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { SignUpDto } from "./dto";
import { AuthEntity } from "./entities/auth.entity";

export class AuthProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, AuthEntity, SignUpDto);
      createMap(
        mapper,
        SignUpDto,
        AuthEntity,
        forMember((dest) => dest.id, ignore())
      );
    };
  }
}
