import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { LoginTicket, TokenPayload } from "google-auth-library";
import { Auth, google } from "googleapis";
import { isValidPhoneNumber } from "libphonenumber-js";
import { ResponseDto } from "../../common/response.dto";
import { responseData } from "../../common/utils";
import {
  ERROR_UNKNOWN,
  ERROR_WRONG_USERNAME_OR_PASSWORD,
} from "../../constants/code-response.constant";
import { UserRolesEnum } from "../../constants/enum";
import { AdminsService } from "../admins/admins.service";
import { UsersService } from "../users/users.service";
import { OtpService } from "./../otp/otp.service";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { SocialDTO } from "./dto/social-login.dto";
import { IAuthService } from "./interfaces/auth-service.interface";
import IGoogleResponse from "./interfaces/auth.interface";
import { IJwtPayloadDreamteam } from "./interfaces/jwt-payload.interface";

@Injectable()
export class AuthService implements IAuthService {
  oauthClient: Auth.OAuth2Client;

  constructor(
    private otpService: OtpService,
    private usersService: UsersService,
    private configService: ConfigService,
    private readonly adminsService: AdminsService,
    private readonly jwtService: JwtService
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
      return responseData(null, null, "ERROR_UNKNOWN");
    }
  }

  async loginWithSocial(socialDTO: SocialDTO) {
    try {
      return await this.usersService.signUp(socialDTO);
    } catch (err: unknown) {
      return err;
    }
  }

  async adminLogin(adminLoginDto: AdminLoginDto): Promise<ResponseDto<string>> {
    try {
      const findData = await this.adminsService.findByUsernameAndPassword(
        adminLoginDto
      );
      if (!findData)
        return responseData(null, null, ERROR_WRONG_USERNAME_OR_PASSWORD);

      const payLoad: IJwtPayloadDreamteam = {
        id: findData.id,
        role: UserRolesEnum.ADMIN,
        phone: this.configService.get("ADMIN_PHONE"),
        isBlock: false,
      };

      const token = this.jwtService.sign(payLoad);
      return responseData(token) as ResponseDto<string>;
    } catch (error) {
      return responseData(null, null, ERROR_UNKNOWN);
    }
  }
  getProfileUser(id: string) {
    return this.usersService.getUserByGetProfile(id);
  }
}
