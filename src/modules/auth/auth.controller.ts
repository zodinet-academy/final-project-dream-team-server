import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { ResponseDto } from "../../common/response.dto";
import { SendOtpDto, VerifyOtpDto } from "../otp/dto";
import { AuthService } from "./auth.service";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { SocialDTO } from "./dto/social-login.dto";
import { JwtAuthGuard } from "./guards";
import { SocialGuard } from "./guards/social.guard";

@ApiTags("auth")
@Controller("secure/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("check-account")
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @UseGuards(SocialGuard)
  @ApiOperation({ summary: "Login with Google account (user)" })
  async loginWithSocial(@Body() socialDTO: SocialDTO) {
    //return req?.isLogin;
    return await this.authService.loginWithSocial(socialDTO);
  }

  @Post("/admin/login")
  @ApiOperation({ summary: "Login with OTP (user)" })
  @ApiOkResponse({ description: "Otp has been sent." })
  @ApiNotAcceptableResponse({ description: "Username or password not match." })
  adminLogin(
    @Body() adminLoginDto: AdminLoginDto
  ): Promise<ResponseDto<string>> {
    return this.authService.adminLogin(adminLoginDto);
  }
  @Get("/profile")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req): Promise<ResponseDto<string | any>> {
    return this.authService.getProfileUser(req.user.id);
  }
}
