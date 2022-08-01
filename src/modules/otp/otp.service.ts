import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { OtpStatus } from "src/constants";
import { Twilio } from "twilio";
import { IOtpService } from "./interfaces/otp-service.interface";

@Injectable()
export class OtpService implements IOtpService {
  private twilioClient: Twilio;
  constructor(private readonly configService: ConfigService) {
    const accountSid = configService.get("TWILIO_ACCOUNT_SID");
    const authToken = configService.get("TWILIO_AUTH_TOKEN");

    this.twilioClient = new Twilio(accountSid, authToken);
  }

  async sendSmsOtp(phoneNumber: string): Promise<boolean> {
    const isValid = isValidPhoneNumber(phoneNumber, "VN");

    if (!isValid)
      throw new HttpException(
        "Phone number is not in correct form.",
        HttpStatus.NOT_ACCEPTABLE
      );

    const phone = parsePhoneNumber(phoneNumber, "VN");

    const serviceSid = this.configService.get("TWILIO_MESSAGING_SERVICES_SID");

    const response = await this.twilioClient.verify.v2
      .services(serviceSid)
      .verifications.create({ to: phone.number, channel: "sms" });

    if (response && response.status === OtpStatus.PENDING) {
      return true;
    }

    return false;
  }

  async confirmOtp(
    phoneNumber: string,
    verificationCode: string
  ): Promise<boolean> {
    const isValid = isValidPhoneNumber(phoneNumber, "VN");
    if (!isValid)
      throw new HttpException(
        "Phone number is not in correct form.",
        HttpStatus.NOT_ACCEPTABLE
      );

    const phone = parsePhoneNumber(phoneNumber, "VN");

    const serviceSid = this.configService.get("TWILIO_MESSAGING_SERVICES_SID");

    const result = await this.twilioClient.verify.v2
      .services(serviceSid)
      .verificationChecks.create({
        to: phone.number,
        code: verificationCode,
      });

    if (!result.valid || result.status !== OtpStatus.APPROVED) {
      throw new HttpException("Wrong code provided", HttpStatus.NOT_ACCEPTABLE);
    }

    return true;
  }
}
