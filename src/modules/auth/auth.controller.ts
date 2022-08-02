import { Body, Controller, Post } from "@nestjs/common";
import {
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ResponseDto } from "src/common/response.dto";
import { getDataError, getDataSuccess } from "src/common/utils";
import { CodeStatus } from "src/constants";
import { SendOtpDto } from "../otp/dto";
import { AuthService } from "./auth.service";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login-normal")
  @ApiOkResponse({ description: "Otp has been sent." })
  @ApiNotAcceptableResponse({
    description: "Phone number is not in correct form.",
  })
  @ApiNotFoundResponse({
    description: "Phone not found.",
  })
  async loginNormal(@Body() data: SendOtpDto) {
    try {
      const isSendSMS = await this.authService.sendOtpLoginNormal(data.phone);
      if (isSendSMS) {
        return getDataSuccess(
          CodeStatus.Success,
          "",
          "OTP has been sent."
        ) as ResponseDto<string>;
      }
    } catch (error) {
      console.log(error);
      return getDataError(
        CodeStatus.InternalServerError,
        "",
        error.message,
        ""
      ) as ResponseDto<string>;
    }
  }
}
