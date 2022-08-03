import { Injectable } from "@nestjs/common";
import { IPhoneOtpService } from "./interfaces";
import { PhoneOtpRepository } from "./phone-otp.repository";

@Injectable()
export class PhoneOtpService implements IPhoneOtpService {
  constructor(private phoneOtpRepository: PhoneOtpRepository) {}

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
      { times: phoneOtp.times + 1 }
    );
  }
}
