import { createMap, Mapper, MappingProfile } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { UserImagesDto } from "./dto";
import { UserImageEntity } from "./entities/user-images.entity";

@Injectable()
export class UserImagesProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, UserImageEntity, UserImagesDto);
    };
  }
}
