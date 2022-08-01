import { Body, Controller, Post } from "@nestjs/common";
import { SendOtpDto, VerifyOtpDto } from "./dto";
import { OtpService } from "./otp.service";

@Controller("otp")
export class OtpControler {
  constructor(private otpService: OtpService) {}
  @Post("send-otp")
  async sendOtp(@Body() data: SendOtpDto) {
    const result = await this.otpService.sendSmsOtp(data.phone);
    if (result) {
      return {
        message: "Otp has been sent.",
      };
    }
    return {
      message: "An error occurs when sending otp sms.",
    };
  }

  @Post("verify-otp")
  async verifyOtp(@Body() data: VerifyOtpDto) {
    const result = await this.otpService.confirmOtp(data.phone, data.code);
    if (result) {
      return {
        message: "Verify otp success.",
      };
    }
    return {
      message: "Verify otp failure.",
    };
  }
}
