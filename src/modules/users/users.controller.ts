import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { DeleteUserDto, PhoneUserDto, UpdateUserDto } from "./dto";
import { GetUser } from "../auth/decorator";
import { JwtAuthGuard } from "../auth/guards";
import { UsersService } from "./users.service";

@Controller("users")
@ApiTags("users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("phone")
  @ApiOperation({ summary: "Get user profile by phone (user)" })
  @ApiOkResponse({ description: "Matching user." })
  @ApiNotAcceptableResponse({
    description: "Phone number is not in correct form.",
  })
  @ApiNotFoundResponse({
    description: "Phone not found.",
  })
  getUserByPhone(@Body() phone: PhoneUserDto) {
    return this.usersService.getUserByPhone(phone.phone);
  }

  @Post("email")
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

  @Post("update")
  @ApiOperation({ summary: "Update user profile by user-id (user)" })
  @ApiOkResponse({ description: "User has been updated." })
  @ApiNotAcceptableResponse({
    description: "Request is not in correct form.",
  })
  @ApiNotFoundResponse({
    description: "User id not found.",
  })
  updateUserProfileById(
    @GetUser("userId") userId: string,
    @Body() dto: UpdateUserDto
  ) {
    return this.usersService.updateUserProfileById(userId, dto);
  }

  @Delete(":userId")
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

  @Get("friends")
  @ApiOperation({ summary: "Get friends list (user)" })
  @ApiOkResponse({ description: "Matching friends list." })
  getListFriends(@GetUser("userId") userId: string) {
    return this.usersService.getListFriends(userId);
  }
}
