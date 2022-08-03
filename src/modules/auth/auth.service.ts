import { Injectable } from "@nestjs/common";
import { isValidPhoneNumber } from "libphonenumber-js";
import { ResponseDto } from "src/common/response.dto";
import { getDataError, getDataSuccess, signToken } from "src/common/utils";
import { CodeStatus } from "src/constants";
import { OtpService } from "../otp/otp.service";
import { UsersService } from "../users/users.service";
import { IAuthService } from "./interfaces/auth-service.interface";
import { ConfigService } from "@nestjs/config";
import { OAuth2Client, LoginTicket, TokenPayload } from "google-auth-library";
import IGoogleResponse from "./interface/auth.interface";

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private otpService: OtpService,
    private usersService: UsersService,
    private configService: ConfigService
  ) {}

  async sendOtpLoginNormal(phone: string): Promise<ResponseDto<string>> {
    const isValid = isValidPhoneNumber(phone, "VN");

    if (!isValid)
      return getDataError(
        CodeStatus.NotAcceptable,
        "PHONE_NOT_CORRECT_FORM",
        "Phone not correct form.",
        ""
      ) as ResponseDto<string>;

    const isExist = await this.checkUserExist(phone);
    if (!isExist)
      return getDataError(
        CodeStatus.NotFountException,
        "PHONE_NOT_FOUND",
        "Phone not found.",
        ""
      ) as ResponseDto<string>;

    const response = await this.otpService.sendSmsOtp(phone);

    if (response.code !== CodeStatus.Success) {
      return response;
    }

    return getDataSuccess(
      CodeStatus.Success,
      "",
      "Send OTP success"
    ) as ResponseDto<string>;
  }

  async loginNormal(phone: string, code: string) {
    const isExist = this.checkUserExist(phone);
    if (!isExist)
      return getDataError(
        CodeStatus.NotFountException,
        "PHONE_NOT_FOUND",
        "Phone not found.",
        ""
      ) as ResponseDto<string>;

    const respone = await this.otpService.confirmOtp(phone, code);

    if (respone.code !== CodeStatus.Success) {
      return respone;
    }

    const user = await this.usersService.getUserByPhone(phone);
    const jwtToken = await signToken(user.id, user.phone);
    return getDataSuccess(
      CodeStatus.Success,
      jwtToken,
      "Login success."
    ) as ResponseDto<string>;
  }

  async checkUserExist(phone: string): Promise<boolean> {
    const user = await this.usersService.getUserByPhone(phone);
    if (!user) {
      return false;
    }
    return true;
  }

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
