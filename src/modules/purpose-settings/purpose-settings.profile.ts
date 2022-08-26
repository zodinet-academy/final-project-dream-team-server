import { createMap, Mapper, MappingProfile } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { ResponsePurposeSettingDto } from "./dto/response-purpose-setting.dto";
import { PurposeSettingEntity } from "./entities/purpose-setting.entity";

@Injectable()
export class PurposeSettingProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, PurposeSettingEntity, ResponsePurposeSettingDto);
    };
  }
}
