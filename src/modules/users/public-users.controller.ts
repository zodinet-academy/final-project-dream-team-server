import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import {
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { PageOptionsDto } from "../../common/dto";
import { SocialDTO } from "../auth/dto/social-login.dto";

import { CreateUserDto, VerifyUserByEmailDto, VerifyUserDto } from "./dto";
import { UsersService } from "./users.service";

@Controller("users")
@ApiTags("users")
export class PublicUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("signup")
  @ApiOperation({ summary: "Register new account (user)" })
  @ApiOkResponse({ description: "New account is created." })
  @ApiNotAcceptableResponse({
    description: "Request is not in correct form.",
  })
  @ApiNotFoundResponse({
    description: "User is existed.",
  })
  signupUser(@Body() dto: SocialDTO) {
    return this.usersService.signUp(dto);
  }

  @Post("verify-user-by-email")
  @ApiOkResponse({ description: "New account is created." })
  @ApiNotAcceptableResponse({
    description: "Request is not in correct form.",
  })
  @ApiNotFoundResponse({
    description: "User is existed.",
  })
  verifyUserByEmail(@Body() dto: VerifyUserByEmailDto) {
    return this.usersService.verifyUserByEmail(dto.email);
  }

  @Post("verify-user")
  @ApiOperation({ summary: "Verify account (user)" })
  @ApiOkResponse({ description: "Your account is verified." })
  @ApiNotAcceptableResponse({
    description: "Request is not in correct form.",
  })
  @ApiNotFoundResponse({
    description: "Action not found.",
  })
  verifyUser(@Body() dto: VerifyUserDto) {
    return this.usersService.verifyUser(dto);
  }

  @Get()
  @ApiOperation({ summary: "Get list of all public users (all)" })
  @ApiOkResponse({ description: "Matching users list." })
  getAllUser(@Query() pageOptionsDto: PageOptionsDto) {
    return this.usersService.getAllUser(pageOptionsDto);
  }

  @Get(":userId")
  @ApiOperation({ summary: "Get public user by user-id" })
  @ApiOkResponse({ description: "Matching user." })
  @ApiNotFoundResponse({
    description: "User id not found.",
  })
  getPublicById(@Param("userId") userId: string) {
    return this.usersService.getPublicById(userId);
  }

  @Post("update-profile")
  async updateUserAfterVerifyPhone(@Body() data: CreateUserDto) {
    return await this.usersService.updateUserAfterVerifyOTP(data);
  }
}
