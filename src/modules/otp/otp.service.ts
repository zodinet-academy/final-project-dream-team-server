import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { Twilio } from "twilio";
import { ResponseDto } from "../../common/response.dto";
import { responseData } from "../../common/utils";
import { OtpStatusEnum } from "../../constants/enum";
import { PhoneOtpService } from "../phone-otp/phone-otp.service";
import { IOtpService } from "./interfaces/otp-service.interface";

@Injectable()
export class OtpService implements IOtpService {
  private twilioClient: Twilio;
  constructor(
    private readonly configService: ConfigService,
    private phoneOtpService: PhoneOtpService
  ) {
    const accountSid = configService.get("TWILIO_ACCOUNT_SID");
    const authToken = configService.get("TWILIO_AUTH_TOKEN");

    this.twilioClient = new Twilio(accountSid, authToken);
  }

  async sendSmsOtp(phoneNumber: string): Promise<ResponseDto<string>> {
    const isValidPhone = isValidPhoneNumber(phoneNumber, "VN");

    if (!isValidPhone)
      return responseData(
        null,
        null,
        "PHONE_NOT_CORRECT_FORM"
      ) as ResponseDto<string>;

    const phone = parsePhoneNumber(phoneNumber, "VN");

    const isValidSendOtp = await this.phoneOtpService.isValidToSendOTP(
      "0" + phone.nationalNumber
    );

    if (!isValidSendOtp)
      return responseData(
        null,
        null,
        "NOT_ALLOW_TO_CREATE_OTP"
      ) as ResponseDto<string>;

    if (process.env.NODE_ENV === "local") {
      return responseData("Please fill otp default") as ResponseDto<string>;
    }
    const serviceSid = this.configService.get("TWILIO_MESSAGING_SERVICES_SID");

    try {
      const response = await this.twilioClient.verify.v2
        .services(serviceSid)
        .verifications.create({ to: phone.number, channel: "sms" });

      if (response && response.status === OtpStatusEnum.PENDING) {
        return responseData("Send OTP success.") as ResponseDto<string>;
      }
    } catch (error) {
      return responseData(
        null,
        "Please wait about 10 minutes and try to create a new otp.",
        "SEND_OTP_ERROR"
      ) as ResponseDto<string>;
    }
  }

  async confirmOtp(
    phoneNumber: string,
    verificationCode: string
  ): Promise<ResponseDto<string>> {
    const isValid = isValidPhoneNumber(phoneNumber, "VN");
    if (!isValid)
      return responseData(
        null,
        "Phone not correct form.",
        "PHONE_NOT_CORRECT_FORM"
      ) as ResponseDto<string>;

    const phone = parsePhoneNumber(phoneNumber, "VN");

    if (process.env.NODE_ENV === "local") {
      if (process.env.OTP_DEFAULT === verificationCode)
        return responseData("Verify OTP success") as ResponseDto<string>;

      const timesLimit = this.configService.get("TIME_LIMIT");
      const countTimesWrongOtp = await this.phoneOtpService.numberOfWrongOtp(
        "0" + phone.nationalNumber
      );

      if (countTimesWrongOtp + 1 >= timesLimit) {
        return responseData(
          null,
          "Exceed times wrong otp",
          "EXCEED_TIMES_WRONG_OTP"
        );
      }

      await this.phoneOtpService.addOneTimeWrongOtp("0" + phone.nationalNumber);

      return responseData(
        null,
        "OTP not valid",
        "OTP_NOT_VALID"
      ) as ResponseDto<string>;
    }
    const serviceSid = this.configService.get("TWILIO_MESSAGING_SERVICES_SID");
    try {
      const result = await this.twilioClient.verify.v2
        .services(serviceSid)
        .verificationChecks.create({
          to: phone.number,
          code: verificationCode,
        });

      if (!result.valid || result.status !== OtpStatusEnum.APPROVED) {
        const timesLimit = this.configService.get("TIME_LIMIT");
        const countTimesWrongOtp = await this.phoneOtpService.numberOfWrongOtp(
          "0" + phone.nationalNumber
        );

        if (countTimesWrongOtp + 1 >= timesLimit) {
          return responseData(
            null,
            "Exceed times wrong otp",
            "EXCEED_TIMES_WRONG_OTP"
          );
        }

        await this.phoneOtpService.addOneTimeWrongOtp(
          "0" + phone.nationalNumber
        );

        return responseData(
          null,
          "OTP not valid",
          "OTP_NOT_VALID"
        ) as ResponseDto<string>;
      }
    } catch (error) {
      console.log(error);
      return responseData(
        null,
        "No OTP found for this phone",
        "NO_OTP_FOR_THIS_PHONE"
      ) as ResponseDto<string>;
    }

    return responseData(true, "", "Verify OTP success") as ResponseDto<string>;
  }
}
