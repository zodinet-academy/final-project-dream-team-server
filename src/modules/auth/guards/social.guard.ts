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
        const isLogin = await this.httpService.axiosRef.get(
          `${this.configService.get("URL_CHECK_FB")}${accessToken}`
        );
        if (isLogin?.data) {
          return true;
        }

        return false;
      } else {
        const isLogin = await this.httpService.axiosRef.get(
          `${this.configService.get("URL_CHECK_GOOGLE")}${accessToken}`
        );
        if (isLogin?.data) {
          return true;
        }

        return false;
      }
    } catch (error: unknown) {
      return false;
    }
  }
}
