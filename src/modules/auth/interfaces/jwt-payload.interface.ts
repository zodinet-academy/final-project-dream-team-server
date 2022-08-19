import { UserRolesEnum } from "../../../constants/enum";

export interface IJwtPayloadDreamteam {
  id: string;
  phone: string;
  role: UserRolesEnum;
}
