import { GenderEnum } from "./../../../constants";
export interface ISystemUserEntity {
  id?: string;
  username?: string;
  password?: string;
  email?: string;
  phone?: string;
  gender?: GenderEnum;
  updatedAt?: Date;
}
