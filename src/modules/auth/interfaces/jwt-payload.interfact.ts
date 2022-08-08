import { UserRoles } from "./../../../constants/roles.enum";
export interface JwtPayload {
  userId: string;
  phone: string;
  role: UserRoles;
}
