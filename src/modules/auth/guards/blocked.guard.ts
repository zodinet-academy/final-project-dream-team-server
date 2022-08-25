import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { SocialEnum } from "../../../constants/enum";
import { JwtService } from "@nestjs/jwt";
import { IJwtPayloadDreamteam } from "../interfaces/jwt-payload.interface";
import { UsersService } from "../../users/users.service";

@Injectable()
export class BlockedGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userServices: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const splitBearer = request.rawHeaders[9].split("Bearer ");
    const decodedJwtAccessToken = this.jwtService.decode(splitBearer[1]);
    const praseToken = decodedJwtAccessToken as IJwtPayloadDreamteam;
    const isBlock = await this.userServices.checkUserIsBlock(praseToken.id);
    if (!isBlock) return true;
    return false;
  }
}
