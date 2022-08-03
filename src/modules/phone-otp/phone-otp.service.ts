import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IPhoneOtpService } from "./interfaces";
import { PhoneOtpRepository } from "./phone-otp.repository";

@Injectable()
export class PhoneOtpService implements IPhoneOtpService {
  constructor(
    private phoneOtpRepository: PhoneOtpRepository,
    private config: ConfigService
  ) {}

  async numberOfWrongOtp(phone: string): Promise<number> {
    console.log(phone);
    const phoneOtp = await this.phoneOtpRepository.findOne({ phone: phone });
    if (!phoneOtp) {
      return 0;
    }
    return phoneOtp.times;
  }

  async addOneTimeWrongOtp(phone: string) {
    const phoneOtp = await this.phoneOtpRepository.findOne({ phone: phone });
    if (!phoneOtp) {
      await this.phoneOtpRepository.save({ phone: phone, times: 1 });
      return;
    }
    await this.phoneOtpRepository.update(
      { phone: phone },
      { times: phoneOtp.times + 1, updated_at: new Date() }
    );
  }

  async isValidToSendOTP(phone: string) {
    const phoneOtp = await this.phoneOtpRepository.findOne({ phone: phone });
    if (phoneOtp) {
      const date = new Date(phoneOtp.updated_at);
      const expired = this.config.get<number>("EXPIRED");
      const timesLimit = this.config.get("TIME_LIMIT");

      console.log("date", date);
      console.log("expired", typeof expired);
      date.setMinutes(date.getMinutes() + +expired);

      const now = new Date();

      console.log("date", date);
      console.log("now", now);

      console.log("now >= date", now >= date);
      console.log(
        "phoneOtp.times + 1 >= timesLimit || phoneOtp.times === 0",
        phoneOtp.times + 1 >= timesLimit || phoneOtp.times === 0
      );

      if (
        (now >= date && phoneOtp.times + 1 >= timesLimit) ||
        phoneOtp.times === 0
      ) {
        this.resetWrongTimes(phone);
        return true;
      }
      return false;
    }
    return true;
  }

  async resetWrongTimes(phone: string) {
    await this.phoneOtpRepository.update(
      { phone: phone },
      { times: 0, updated_at: new Date() }
    );
  }
}
