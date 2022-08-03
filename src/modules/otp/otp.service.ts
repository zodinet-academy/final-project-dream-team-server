import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { ResponseDto } from "src/common/response.dto";
import { getDataError, getDataSuccess } from "src/common/utils";
import { CodeStatus, OtpStatus } from "src/constants";
import { Twilio } from "twilio";
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
    const isValid = isValidPhoneNumber(phoneNumber, "VN");

    if (!isValid)
      return getDataError(
        CodeStatus.NotAcceptable,
        "PHONE_NOT_CORRECT_FORM",
        "Phone not correct form.",
        ""
      ) as ResponseDto<string>;

    const phone = parsePhoneNumber(phoneNumber, "VN");

    const serviceSid = this.configService.get("TWILIO_MESSAGING_SERVICES_SID");
    try {
      const response = await this.twilioClient.verify.v2
        .services(serviceSid)
        .verifications.create({ to: phone.number, channel: "sms" });

      if (response && response.status === OtpStatus.PENDING) {
        return getDataSuccess(
          CodeStatus.Success,
          "",
          "Send OTP success."
        ) as ResponseDto<string>;
      }
    } catch (error) {
      return getDataError(
        CodeStatus.InternalServerError,
        "SEND_OTP_ERROR",
        "Please wait about 10 minutes and try to create a new otp.",
        ""
      ) as ResponseDto<string>;
    }
  }

  async confirmOtp(
    phoneNumber: string,
    verificationCode: string
  ): Promise<ResponseDto<string>> {
    const isValid = isValidPhoneNumber(phoneNumber, "VN");
    if (!isValid)
      return getDataError(
        CodeStatus.NotAcceptable,
        "PHONE_NOT_CORRECT_FORM",
        "Phone not correct form.",
        ""
      ) as ResponseDto<string>;

    const phone = parsePhoneNumber(phoneNumber, "VN");

    const serviceSid = this.configService.get("TWILIO_MESSAGING_SERVICES_SID");
    try {
      const result = await this.twilioClient.verify.v2
        .services(serviceSid)
        .verificationChecks.create({
          to: phone.number,
          code: verificationCode,
        });

      if (!result.valid || result.status !== OtpStatus.APPROVED) {
        const timesLimit = this.configService.get("TIME_LIMIT");
        const countTimesWrongOtp = await this.phoneOtpService.numberOfWrongOtp(
          "0" + phone.nationalNumber
        );

        if (countTimesWrongOtp + 1 >= timesLimit) {
          return getDataError(
            CodeStatus.BadRequestException,
            "EXCEED_TIMES_WRONG_OTP",
            "Exceed times wrong otp",
            ""
          );
        }

        await this.phoneOtpService.addOneTimeWrongOtp(
          "0" + phone.nationalNumber
        );

        return getDataError(
          CodeStatus.NotAcceptable,
          "OTP_NOT_VALID",
          "OTP not valid",
          ""
        ) as ResponseDto<string>;
      }
    } catch (error) {
      return getDataError(
        CodeStatus.NotFound,
        "NO_OTP_FOR_THIS_PHONE",
        "No OTP found for this phone",
        ""
      ) as ResponseDto<string>;
    }

    return getDataSuccess(
      CodeStatus.Success,
      "",
      "Verify OTP success"
    ) as ResponseDto<string>;
  }
}
