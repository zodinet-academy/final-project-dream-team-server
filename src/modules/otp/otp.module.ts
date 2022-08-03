import { Module } from "@nestjs/common";
import { PhoneOtpModule } from "../phone-otp/phone-otp.module";
import { OtpControler } from "./otp.controller";
import { OtpService } from "./otp.service";

@Module({
  imports: [PhoneOtpModule],
  providers: [OtpService],
  controllers: [OtpControler],
  exports: [OtpService],
})
export class OtpModule {}
