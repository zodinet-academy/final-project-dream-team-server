import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import {
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { VerifyUserByEmailDto, VerifyUserDto } from "./dto/verify-user.dto";
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
  signupUser(@Body() dto: CreateUserDto) {
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
  getAllUser() {
    return this.usersService.getAllUser();
  }

  @Get(":userId")
  @ApiOperation({ summary: "Get public user by user-id (all)" })
  @ApiOkResponse({ description: "Matching user." })
  @ApiNotFoundResponse({
    description: "User id not found.",
  })
  getPublicById(@Param("userId") userId: string) {
    return this.usersService.getPublicById(userId);
  }
}
