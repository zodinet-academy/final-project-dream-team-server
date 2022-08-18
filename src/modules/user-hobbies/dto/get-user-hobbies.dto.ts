import { AutoMap } from "@automapper/classes";
import { IUserHobbyEntity } from "../interfaces";

export class GetUserHobbiesDto implements IUserHobbyEntity {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;
}
