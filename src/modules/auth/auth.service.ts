import { getDataError } from "src/common/utils";
import { getDataSuccess } from "../../common/utils";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { OAuth2Client, LoginTicket, TokenPayload } from "google-auth-library";
import { CodeStatus } from "src/constants";
import IGoogleResponse from "./interface/auth.interface";

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}
  async verifyGoogle(token: string) {
    try {
      const client: OAuth2Client = new OAuth2Client(
        this.configService.get("CLIENT_ID")
      );
      const ticket: LoginTicket = await client.verifyIdToken({
        idToken: token,
        audience: this.configService.get("CLIENT_ID"),
      });
      const payload: TokenPayload = ticket.getPayload();
      const googleResponse: IGoogleResponse = {
        email: payload.email,
        avatar: payload.picture,
        fullname: `${payload.family_name} ${payload.given_name}`,
        nickname: payload.name,
      };
      return getDataSuccess(CodeStatus.Success, googleResponse);
    } catch (error) {
      return getDataError(
        CodeStatus.InternalServerError,
        "ERROR_UNKNOW",
        error
      );
    }
  }
}
