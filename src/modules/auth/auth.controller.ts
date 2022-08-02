import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { GoogleLoginDto } from "./dto/google-login.dto";

@Controller("auth")
@ApiTags("authentication")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("login-google")
  async loginGoogle(@Body() googleLoginDto: GoogleLoginDto) {
    return this.authService.loginGoogle(googleLoginDto.token);
  }
}
