import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PhoneOtpRepository } from "./phone-otp.repository";
import { PhoneOtpService } from "./phone-otp.service";

@Module({
  imports: [TypeOrmModule.forFeature([PhoneOtpRepository])],
  providers: [PhoneOtpService],
  exports: [PhoneOtpService],
})
export class PhoneOtpModule {}
