import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { ResponseDto } from "../../common/response.dto";
import { AuthService } from "./auth.service";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { JwtAuthGuard } from "./guards";
import { BlockedGuard } from "./guards/blocked.guard";

@ApiTags("auth")
@Controller("secure/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

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
  @UseGuards(JwtAuthGuard, BlockedGuard)
  getProfile(@Req() req): Promise<ResponseDto<string | any>> {
    return this.authService.getProfileUser(req.user.id);
  }
}
