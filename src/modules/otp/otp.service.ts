import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APPROVED, PENDING } from "src/constants";
import { Twilio } from "twilio";

@Injectable()
export class OtpService {
  private twilioClient: Twilio;
  constructor(private readonly configService: ConfigService) {
    const accountSid = configService.get("TWILIO_ACCOUNT_SID");
    const authToken = configService.get("TWILIO_AUTH_TOKEN");

    this.twilioClient = new Twilio(accountSid, authToken);
  }

  async sendSmsOtp(phoneNumber: string): Promise<boolean> {
    const serviceSid = this.configService.get("TWILIO_MESSAGING_SERVICES_SID");

    const response = await this.twilioClient.verify.v2
      .services(serviceSid)
      .verifications.create({ to: phoneNumber, channel: "sms" });

    if (response && response.status === PENDING) {
      return true;
    }
    return false;
  }

  async confirmOtp(
    phoneNumber: string,
    verificationCode: string
  ): Promise<boolean> {
    const serviceSid = this.configService.get("TWILIO_MESSAGING_SERVICES_SID");

    const result = await this.twilioClient.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phoneNumber, code: verificationCode });

    if (!result.valid || result.status !== APPROVED) {
      throw new BadRequestException("Wrong code provided");
    }

    return true;
  }
}
