import { AutoMap } from "@automapper/classes";

export class UserResponeDTO {
  @AutoMap()
  id: string;
  @AutoMap()
  email: string;
  @AutoMap()
  avatart: string;
  @AutoMap()
  name: string;
  @AutoMap()
  birthday: Date;
  @AutoMap()
  createAt: Date;
  @AutoMap()
  updateAt: Date;
}
