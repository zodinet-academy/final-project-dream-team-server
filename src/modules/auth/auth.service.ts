import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { isValidPhoneNumber } from "libphonenumber-js";
import { OtpService } from "../otp/otp.service";
import { UsersService } from "../users/users.service";
import { IAuthService } from "./interfaces/auth-service.interface";

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private otpService: OtpService,
    private usersService: UsersService
  ) {}

  async sendOtpLoginNormal(phone: string): Promise<boolean> {
    const isValid = isValidPhoneNumber(phone, "VN");

    if (!isValid)
      throw new HttpException(
        "Phone number is not in correct form.",
        HttpStatus.NOT_ACCEPTABLE
      );

    const user = await this.usersService.getUserByPhone(phone);
    if (!user) {
      throw new HttpException("Phone not found.", HttpStatus.NOT_FOUND);
    }

    this.otpService.sendSmsOtp(phone);

    return true;
  }
}
