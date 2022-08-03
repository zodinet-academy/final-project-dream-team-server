import { Body, Controller, Post } from "@nestjs/common";
import {
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { SendOtpDto, VerifyOtpDto } from "../otp/dto";
import { AuthService } from "./auth.service";
import GoogleVerificationDto from "./dto/google-verification.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("send-otp-login-normal")
  @ApiOkResponse({ description: "Otp has been sent." })
  @ApiNotAcceptableResponse({
    description: "Phone number is not in correct form.",
  })
  @ApiNotFoundResponse({
    description: "Phone not found.",
  })
  async sendOtploginNormal(@Body() data: SendOtpDto) {
    return this.authService.sendOtpLoginNormal(data.phone);
  }

  @Post("verify-otp-login")
  @ApiOkResponse({ description: "Otp has been sent." })
  @ApiNotAcceptableResponse({
    description: "Phone number is not in correct form.",
  })
  @ApiNotAcceptableResponse({
    description: "Cannot find OTP for this phone.",
  })
  @ApiNotAcceptableResponse({
    description: "Invalid code provided.",
  })
  @ApiNotFoundResponse({
    description: "Phone not found.",
  })
  async verifyOtpLogin(@Body() data: VerifyOtpDto) {
    return this.authService.loginNormal(data.phone, data.code);
  }

  @Post("verify-google")
  async verifyGoogle(@Body() googleVerificationDto: GoogleVerificationDto) {
    return this.authService.verifyGoogle(googleVerificationDto.token);
  }
}
