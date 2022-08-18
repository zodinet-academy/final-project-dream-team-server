import { AutoMap } from "@automapper/classes";
import {
  AlcoholEnum,
  EducationEnum,
  GenderEnum,
  MaritalStatusEnum,
  ReligionEnum,
} from "../../../constants/enum";
import { GetUserHobbiesDto } from "../../user-hobbies/dto";
import { UserImagesDto } from "../../user-images/dto";
import { IUserEntity } from "../interfaces";

export class UserProfileDto implements IUserEntity {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  avatar: string;

  @AutoMap()
  email: string;

  @AutoMap()
  phone: string;

  @AutoMap()
  birthday: Date;

  @AutoMap()
  gender: GenderEnum;

  @AutoMap()
  purposeId: string;

  @AutoMap()
  description: string;

  @AutoMap()
  children: number;

  @AutoMap()
  alcohol: AlcoholEnum;

  @AutoMap()
  religion: ReligionEnum;

  @AutoMap()
  education: EducationEnum;

  @AutoMap()
  height: number;

  @AutoMap()
  maritalStatus: MaritalStatusEnum;

  @AutoMap()
  isBlock: boolean;

  @AutoMap()
  isVerify: boolean;

  album: UserImagesDto[];

  hobbies: GetUserHobbiesDto[];
}
