import { UserRolesEnum } from "../../../constants/enum";

export interface JwtPayload {
  userId: string;
  phone: string;
  role: UserRolesEnum;
}
export interface IJwtServicePayload {
  id: string;
  name: string;
  email: string;
  phone: string;
}
