import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LoginTicket, TokenPayload } from "google-auth-library";
import { Auth, google } from "googleapis";
import { isValidPhoneNumber } from "libphonenumber-js";
import { ResponseDto } from "../../common/response.dto";
import { responseData, signToken } from "../../common/utils";
import { UsersService } from "../users/users.service";
import { OtpService } from "./../otp/otp.service";
import { UserEntity } from "./../users/entities/user.entity";
import { GoogleLoginDto } from "./dto/google-login.dto";
import { IAuthService } from "./interfaces/auth-service.interface";
import IGoogleResponse from "./interfaces/auth.interface";
import { AdminLoginDto } from "./dto/admin-login.dto";
import {
  ERROR_UNKNOWN,
  ERROR_WRONG_USERNAME_OR_PASSWORD,
} from "../../constants/code-response.constant";
import { UserRolesEnum } from "../../constants/enum";
import { AdminsService } from "../admins/admins.service";

@Injectable()
export class AuthService implements IAuthService {
  oauthClient: Auth.OAuth2Client;

  constructor(
    private otpService: OtpService,
    private usersService: UsersService,
    private configService: ConfigService,
    private readonly adminsService: AdminsService
  ) {
    const clientID = this.configService.get("CLIENT_ID");
    const clientSecret = this.configService.get("CLIENT_SECRET");

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async sendOtpLoginNormal(phone: string): Promise<ResponseDto<string>> {
    const isValid = isValidPhoneNumber(phone, "VN");

    if (!isValid)
      return responseData(
        "Phone not correct form.",
        null,
        "PHONE_NOT_CORRECT_FORM"
      ) as ResponseDto<string>;

    const isExist = await this.checkUserExist(phone);
    if (!isExist)
      return responseData(
        null,
        "Phone not found.",
        "PHONE_NOT_FOUND"
      ) as ResponseDto<string>;

    const response = await this.otpService.sendSmsOtp(phone);

    if (!response.status) {
      return response;
    }

    return responseData("Send OTP success") as ResponseDto<string>;
  }

  async loginNormal(phone: string, code: string) {
    const isExist = await this.checkUserExist(phone);
    if (!isExist)
      return responseData(
        null,
        "Phone not found.",
        "PHONE_NOT_FOUND"
      ) as ResponseDto<string>;

    const respone = await this.otpService.confirmOtp(phone, code);

    if (!respone.status) {
      return respone;
    }

    const user = await this.usersService.getUserByPhone(phone);
    const jwtToken = await signToken(
      user?.data.id,
      user?.data.phone,
      UserRolesEnum.USER
    );
    return responseData(jwtToken);
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
      return responseData(googleResponse);
    } catch (error) {
      return responseData(null, null, "ERROR_UNKNOW");
    }
  }

  async loginGoogle(
    googleLoginDto: GoogleLoginDto
  ): Promise<ResponseDto<any | IGoogleResponse | string>> {
    try {
      const verifiedData = await this.verifyGoogle(googleLoginDto.token);

      if (!verifiedData.status) return verifiedData;
      const { email } = verifiedData.data as IGoogleResponse;

      const findData = await this.usersService.getUserByEmail(email);
      if (!findData.status) {
        verifiedData.data["isNewUser"] = true;
        return verifiedData;
      }

      const { phone } = findData.data as UserEntity;
      return responseData({
        isNewUsers: false,
        sentOtp: await this.otpService.sendSmsOtp(phone),
      });
    } catch (error) {
      return responseData(null, null, "ERROR_UNKNOW");
    }
  }

  async adminLogin(adminLoginDto: AdminLoginDto): Promise<ResponseDto<string>> {
    try {
      const findData = await this.adminsService.findByUsernameAndPassword(
        adminLoginDto
      );
      if (!findData)
        return responseData(null, null, ERROR_WRONG_USERNAME_OR_PASSWORD);
      // const jwtToken = await signToken(findData.id, null, UserRolesEnum.ADMIN);
      return responseData("jwtToken") as ResponseDto<string>;
    } catch (error) {
      return responseData(null, null, ERROR_UNKNOWN);
    }
  }
}
