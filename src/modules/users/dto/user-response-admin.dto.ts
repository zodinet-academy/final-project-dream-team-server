import { AutoMap } from "@automapper/classes";
import { IUserEntity } from "../interfaces/user-entity.interface";

export class UserResponseAdminDto implements IUserEntity {
  @AutoMap()
  id: string;
  @AutoMap()
  email: string;
  @AutoMap()
  avatar: string;
  @AutoMap()
  name: string;
  @AutoMap()
  birthday: Date;
  @AutoMap()
  createAt: Date;
  @AutoMap()
  updateAt: Date;
  @AutoMap()
  isBlock: boolean;
  @AutoMap()
  isVerify: boolean;
}
