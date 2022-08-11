import { GenderEnum } from "../../../constants/enum";

export interface IUserEntity {
  id?: string;
  avatar?: string;
  nickname?: string;
  fullname?: string;
  email?: string;
  phone?: string;
  gender?: GenderEnum;
  isBlock?: boolean;
  balance?: number;
  deletedAt?: Date;
}
