import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserRolesEnum } from "../../../constants/enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<UserRolesEnum[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    if (!request.headers["authorization"]) return false;
    const { user } = request;

    if (!user || !user.role) return false;
    return this.matchRoles(roles, user.role);
  }
  matchRoles(roles: UserRolesEnum[], role: string) {
    return roles.find((el) => el === role) ? true : false;
  }
}
