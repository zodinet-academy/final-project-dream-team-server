import { GenderType } from "src/constants/gender.enum";

export interface IUserEntity {
  id: string;
  avatar: string;
  nickname: string;
  fullname: string;
  phone: string;
  gender: GenderType;
  is_block: boolean;
  balance: number;
  lat: number;
  lng: number;
  deleted_at: Date;
}
