import { GenderEnum } from "../../../constants/enum";

export interface IUserEntity {
  id?: string;
  avatar?: string;
  name?: string;
  email?: string;
  phone?: string;
  gender?: GenderEnum;
  isBlock?: boolean;
  balance?: number;
  deletedAt?: Date;
}
