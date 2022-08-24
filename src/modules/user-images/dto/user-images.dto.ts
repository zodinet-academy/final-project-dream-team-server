import { AutoMap } from "@automapper/classes";
import { IUserImageEntity } from "../interfaces";

export class UserImagesDto implements IUserImageEntity {
  @AutoMap()
  id: string;

  @AutoMap()
  url: string;

  @AutoMap()
  isFavorite: boolean;
}
