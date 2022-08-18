import {
  AlcoholEnum,
  EducationEnum,
  GenderEnum,
  MaritalStatusEnum,
} from "../../../constants/enum";

export interface IUserEntity {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  birthday?: Date;
  avatar?: string;
  gender?: GenderEnum;
  description?: string;
  children?: number;
  alcohol?: AlcoholEnum;
  religion?: string;
  height?: number;
  maritalStatus?: MaritalStatusEnum;
  education?: EducationEnum;
  isBlock?: boolean;
  isVerify?: boolean;
  purposeId?: string;
  updatedAt?: Date;
  deletedAt?: Date;
}
