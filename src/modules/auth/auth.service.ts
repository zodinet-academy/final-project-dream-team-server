import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LoginTicket, TokenPayload } from "google-auth-library";
import { Auth, google } from "googleapis";
import { isValidPhoneNumber } from "libphonenumber-js";
import { ResponseDto } from "../../common/response.dto";
import { getDataError, signToken, getDataSuccess } from "../../common/utils";
import { CodeStatus } from "../../constants";
import { UsersService } from "../users/users.service";
import { OtpService } from "./../otp/otp.service";
import { UserEntity } from "./../users/entities/user.entity";
import { GoogleLoginDto } from "./dto/google-login.dto";
import { IAuthService } from "./interfaces/auth-service.interface";
import IGoogleResponse from "./interfaces/auth.interface";

@Injectable()
export class AuthService implements IAuthService {
  oauthClient: Auth.OAuth2Client;

  constructor(
    private otpService: OtpService,
    private usersService: UsersService,
    private configService: ConfigService
  ) {
    const clientID = this.configService.get("CLIENT_ID");
    const clientSecret = this.configService.get("CLIENT_SECRET");

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

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
      const ticket: LoginTicket = await this.oauthClient.verifyIdToken({
        idToken: token,
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
    googleLoginDto: GoogleLoginDto
  ): Promise<ResponseDto<UserEntity | IGoogleResponse | string>> {
    try {
      const verifiedData = await this.verifyGoogle(googleLoginDto.token);

      if (verifiedData.code !== CodeStatus.Success) return verifiedData;
      const { email } = verifiedData.data as IGoogleResponse;

      const findData = await this.usersService.getUserByEmail(email);
      if (findData.code !== CodeStatus.Success) {
        verifiedData.data["isNewUser"] = true;
        return verifiedData;
      }

      const { phone } = findData.data as UserEntity;
      return getDataSuccess(
        CodeStatus.Success,
        {
          isNewUsers: false,
          sentOtp: await this.otpService.sendSmsOtp(phone),
        },
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
