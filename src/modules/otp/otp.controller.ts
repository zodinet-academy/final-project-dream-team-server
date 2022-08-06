import { Body, Controller, Post } from "@nestjs/common";
import {
  ApiInternalServerErrorResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { ResponseDto } from "src/common/response.dto";
import { SendOtpDto, VerifyOtpDto } from "./dto";
import { OtpService } from "./otp.service";

@ApiTags("otp")
@Controller("otp")
export class OtpControler {
  constructor(private otpService: OtpService) {}

  @Post("send-otp")
  @ApiOperation({ summary: "Send OTP code (user)" })
  @ApiOkResponse({ description: "Otp has been sent." })
  @ApiInternalServerErrorResponse({
    description: "An error occurs when sending otp sms.",
  })
  @ApiNotAcceptableResponse({
    description: "Phone number is not in correct form.",
  })
  async sendOtp(@Body() data: SendOtpDto): Promise<ResponseDto<string>> {
    return this.otpService.sendSmsOtp(data.phone);
  }

  @Post("verify-otp")
  @ApiOperation({ summary: "Verify received OTP (user)" })
  @ApiOkResponse({ description: "Verify otp success." })
  @ApiNotAcceptableResponse({ description: "Wrong otp provided." })
  @ApiNotFoundResponse({ description: "Cannot find otp for this phone." })
  async verifyOtp(@Body() data: VerifyOtpDto) {
    return this.otpService.confirmOtp(data.phone, data.code);
  }
}
