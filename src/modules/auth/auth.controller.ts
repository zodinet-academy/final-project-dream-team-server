import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import GoogleVerificationDto from "./dto/google-verification.dto";

@Controller("auth")
@ApiTags("authentication")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("verify-google")
  async verifyGoogle(@Body() googleVerificationDto: GoogleVerificationDto) {
    return this.authService.verifyGoogle(googleVerificationDto.token);
  }
}
