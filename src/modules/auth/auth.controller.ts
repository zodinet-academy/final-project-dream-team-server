import { Body, Controller, Post } from "@nestjs/common";
import {
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { SendOtpDto, VerifyOtpDto } from "../otp/dto";
import { AuthService } from "./auth.service";
import { GoogleLoginDto } from "./dto/google-login.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("check-account")
  @ApiOperation({ summary: "Check user account existed by phone (user)" })
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

  @Post("otp-login")
  @ApiOperation({ summary: "Login with OTP (user)" })
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

  @Post("login-google")
  @ApiOperation({ summary: "Login with Google account (user)" })
  async loginGoogle(@Body() googleLoginDto: GoogleLoginDto) {
    return this.authService.loginGoogle(googleLoginDto);
  }
}
