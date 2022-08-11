import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { SocialEnum } from "../../../constants/enum";

@Injectable()
export class SocialGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { accessToken, typeSocial } = request.body;

      if (typeSocial === SocialEnum.FACEBOOK) {
        const isLogin: boolean = await this.httpService.axiosRef.get(
          `${this.configService.get("URL_CHECK_FB")}${accessToken}`
        );

        return isLogin;
      } else {
        const isLogin: boolean = await this.httpService.axiosRef.get(
          `${this.configService.get("URL_CHECK_GG")}${accessToken}`
        );

        return isLogin;
      }
    } catch (error: unknown) {
      return false;
    }
  }
}
