import { Mapper, MappingProfile, createMap } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { UserProfileDto } from "./dto";
import { FriendDto } from "./dto/friend.dto";
import { UserResponeDTO } from "./dto/user-respone.dto";
import { UserResponseAdminDto } from "./dto/user-response-admin.dto";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, UserEntity, FriendDto);
      createMap(mapper, UserEntity, UserProfileDto);
      createMap(mapper, UserEntity, UserResponeDTO);
      createMap(mapper, UserEntity, UserResponseAdminDto);
    };
  }
}
