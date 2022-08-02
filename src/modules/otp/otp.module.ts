import { Module } from "@nestjs/common";
import { OtpControler } from "./otp.controller";
import { OtpService } from "./otp.service";

@Module({
  providers: [OtpService],
  controllers: [OtpControler],
  exports: [OtpService],
})
export class OtpModule {}
