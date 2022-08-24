import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import {
  ApiInternalServerErrorResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { RateLimit } from "nestjs-rate-limiter";
import { ResponseDto } from "../../common/response.dto";
import { SocialGuard } from "../auth/guards/social.guard";
import { SendOtpDto, VerifyOtpDto } from "./dto";
import { CheckUserVerifiedDTO } from "./dto/check-user-verified.dto";
import { OtpService } from "./otp.service";

@ApiTags("otp")
@Controller("otp")
export class OtpControler {
  constructor(private otpService: OtpService) {}
  @RateLimit({
    keyPrefix: "send-otp",
    points: 1,
    duration: 10,
    errorMessage: "OTP Cannot Be Created More Than Once In 10 Minute",
  })
  @Post("send-otp")
  @ApiOperation({ summary: "Send OTP code (user)" })
  @ApiOkResponse({ description: "Otp has been sent." })
  @ApiInternalServerErrorResponse({
    description: "An error occurs when sending otp sms.",
  })
  @ApiNotAcceptableResponse({
    description: "Phone number is not in correct form.",
  })
  sendOtp(@Body() data: SendOtpDto): Promise<ResponseDto<string>> {
    return this.otpService.sendSmsOtp(data.phone);
  }

  @Post("verify-otp")
  @ApiOperation({ summary: "Verify received OTP (user)" })
  @ApiOkResponse({ description: "Verify otp success." })
  @ApiNotAcceptableResponse({ description: "Wrong otp provided." })
  @ApiNotFoundResponse({ description: "Cannot find otp for this phone." })
  verifyOtp(@Body() data: VerifyOtpDto) {
    return this.otpService.confirmOtp(data.phone, data.code);
  }

  @Post("verify-otp-social")
  @ApiOperation({ summary: "Verify received OTP (user)" })
  @ApiOkResponse({ description: "Verify otp success." })
  @ApiNotAcceptableResponse({ description: "Wrong otp provided." })
  @ApiNotFoundResponse({ description: "Cannot find otp for this phone." })
  verifyOtpDreamTeam(@Body() data: VerifyOtpDto) {
    return this.otpService.confirmOtpWithSocial(
      data.phone,
      data.code,
      data.email
    );
  }

  @Post("user-verified")
  @UseGuards(SocialGuard)
  checkUserVerified(@Body() data: CheckUserVerifiedDTO) {
    return this.otpService.checkUserVerified(data.email);
  }
}
