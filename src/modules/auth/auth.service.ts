import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LoginTicket, OAuth2Client, TokenPayload } from "google-auth-library";
import { getDataError, getDataSuccess } from "../../common/utils";
import { CodeStatus } from "../../constants/codeStatus.enum";
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
