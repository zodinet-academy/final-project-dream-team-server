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
      { times: phoneOtp.times + 1 }
    );
  }

  async isValidToSendOTP(phone: string) {
    const phoneOtp = await this.phoneOtpRepository.findOne({ phone: phone });
    if (phoneOtp) {
      const date = new Date(phoneOtp.updatedAt);
      const expired = this.config.get<number>("EXPIRED");
      const timesLimit = this.config.get("TIME_LIMIT");

      date.setMinutes(date.getMinutes() + +expired);

      const now = new Date();

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
    await this.phoneOtpRepository.update({ phone: phone }, { times: 0 });
  }
}
