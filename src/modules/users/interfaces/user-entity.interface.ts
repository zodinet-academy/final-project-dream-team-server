import { GenderType } from "src/constants/gender.enum";

export interface IUserEntity {
  id?: string;
  avatar?: string;
  nickname?: string;
  fullname?: string;
  email?: string;
  phone?: string;
  gender?: GenderType;
  isBlock?: boolean;
  balance?: number;
  lat?: number;
  lng?: number;
  deletedAt?: Date;
}
