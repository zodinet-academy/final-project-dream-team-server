import { Body, Controller, HttpException, Post } from "@nestjs/common";
import {
  ApiInternalServerErrorResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ResponseDto } from "src/common/response.dto";
import { getDataError, getDataSuccess } from "src/common/utils";
import { CodeStatus } from "src/constants";
import { SendOtpDto, VerifyOtpDto } from "./dto";
import { OtpService } from "./otp.service";

@ApiTags("otp")
@Controller("otp")
export class OtpControler {
  constructor(private otpService: OtpService) {}

  @Post("send-otp")
  @ApiOkResponse({ description: "Otp has been sent." })
  @ApiInternalServerErrorResponse({
    description: "An error occurs when sending otp sms.",
  })
  @ApiNotAcceptableResponse({
    description: "Phone number is not in correct form.",
  })
  async sendOtp(@Body() data: SendOtpDto): Promise<ResponseDto<string>> {
    return this.otpService.sendSmsOtp(data.phone);
    // try {
    //   await this.otpService.sendSmsOtp(data.phone);
    //   return getDataSuccess(
    //     CodeStatus.Success,
    //     "",
    //     "OTP has been sent."
    //   ) as ResponseDto<string>;
    // } catch (error) {
    //   return getDataError(
    //     CodeStatus.InternalServerError,
    //     "",
    //     error.message,
    //     ""
    //   ) as ResponseDto<string>;
    // }
  }

  @Post("verify-otp")
  @ApiOkResponse({ description: "Verify otp success." })
  @ApiNotAcceptableResponse({ description: "Wrong otp provided." })
  @ApiNotFoundResponse({ description: "Cannot find otp for this phone." })
  async verifyOtp(@Body() data: VerifyOtpDto) {
    // try {
    //   await this.otpService.confirmOtp(data.phone, data.code);
    //   return getDataSuccess(
    //     CodeStatus.Success,
    //     "",
    //     "Verify otp success."
    //   ) as ResponseDto<string>;
    // } catch (error) {
    //   return getDataError(
    //     error.status,
    //     "",
    //     error.message,
    //     ""
    //   ) as ResponseDto<string>;
    // }
    return this.otpService.confirmOtp(data.phone, data.code);
  }
}
