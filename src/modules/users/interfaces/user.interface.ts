import { GenderType } from "src/constants/gender.enum";

export interface IUser {
  id: string;
  avatar: string;
  nick_name: string;
  full_name: string;
  phone: string;
  gender: GenderType;
}
