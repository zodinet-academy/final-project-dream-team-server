import { createMap, Mapper, MappingProfile } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { ResponseProductImagesDto } from "./dto";
import { ProductImagesEntity } from "./entities/product-images.entity";

@Injectable()
export class ProductImagesProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, ProductImagesEntity, ResponseProductImagesDto);
    };
  }
}
