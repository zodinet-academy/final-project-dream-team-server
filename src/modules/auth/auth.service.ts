import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LoginTicket, OAuth2Client, TokenPayload } from "google-auth-library";
import { ResponseDto } from "src/common/response.dto";
import { getDataError } from "src/common/utils";
import { CodeStatus } from "src/constants";
import { getDataSuccess } from "../../common/utils";
import { UsersService } from "../users/users.service";
import { OtpService } from "./../otp/otp.service";
import { UserEntity } from "./../users/entities/user.entity";
import IGoogleResponse from "./interface/auth.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly otpService: OtpService
  ) {}
  async verifyGoogle(
    token: string
  ): Promise<ResponseDto<IGoogleResponse | string>> {
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

  async loginGoogle(
    token: string
  ): Promise<ResponseDto<UserEntity | IGoogleResponse | string>> {
    try {
      const verifiedData = await this.verifyGoogle(token);
      if (verifiedData.code !== CodeStatus.Success) return verifiedData;
      const { email } = verifiedData.data as IGoogleResponse;
      const findData = await this.usersService.findByEmail(email);
      if (findData.code !== CodeStatus.Success) return verifiedData;
      const { phone } = findData.data as UserEntity;
      await this.otpService.sendSmsOtp(phone);
      return getDataSuccess(
        CodeStatus.Success,
        await this.otpService.sendSmsOtp(phone),
        ""
      );
    } catch (error) {
      return getDataError(
        CodeStatus.InternalServerError,
        "ERROR_UNKNOW",
        error
      );
    }
  }
}
