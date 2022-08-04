import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { DeleteUserDto, UpdateUserDto } from "./dto";
import { UsersService } from "./users.service";

type PhoneNumber = {
  phone: string;
};
@Controller("users")
@ApiTags("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: "Get list of all public users (all)" })
  @ApiOkResponse({ description: "Matching user lists." })
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

  @Post("/phone")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user profile by phone (user)" })
  @ApiOkResponse({ description: "Matching user." })
  @ApiNotAcceptableResponse({
    description: "Phone number is not in correct form.",
  })
  @ApiNotFoundResponse({
    description: "Phone not found.",
  })
  getUserByPhone(@Body() phone: PhoneNumber) {
    return this.usersService.getUserByPhone(phone.phone);
  }

  @Post("/email")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user profile by email (user)" })
  @ApiOkResponse({ description: "Matching user." })
  @ApiNotAcceptableResponse({
    description: "Email is not in correct form.",
  })
  @ApiNotFoundResponse({
    description: "Email not found.",
  })
  getUserByEmail(@Body() email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Post(":userId")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update user profile by user-id (user)" })
  @ApiOkResponse({ description: "User has been updated." })
  @ApiNotAcceptableResponse({
    description: "Request is not in correct form.",
  })
  @ApiNotFoundResponse({
    description: "User id not found.",
  })
  updateUserProfileById(
    @Param("userId") userId: string,
    @Body() dto: UpdateUserDto
  ) {
    return this.usersService.updateUserProfileById(userId, dto);
  }

  @Delete(":userId")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete user data (admin)" })
  @ApiOkResponse({ description: "User has been deleted." })
  @ApiNotAcceptableResponse({
    description: "Request is not in correct form.",
  })
  @ApiNotFoundResponse({
    description: "User id not found.",
  })
  deleteUserProfileById(
    @Param("userId") userId: string,
    @Body() dto: DeleteUserDto
  ) {
    return this.usersService.deleteUserProfileById(userId, dto);
  }
}
