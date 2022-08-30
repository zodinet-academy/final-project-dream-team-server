import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UsersService } from "../../users/users.service";

@Injectable()
export class BlockedGuard implements CanActivate {
  constructor(private readonly userServices: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers["authorization"]) return false;
    const { user } = request;
    const isBlocked = await this.checkIsBlockedUser(user.id);
    return !isBlocked;
  }
  async checkIsBlockedUser(id) {
    return await this.userServices.checkUserIsBlock(id);
  }
}
