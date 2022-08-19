import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { GetUser } from "../auth/decorator";
import { JwtAuthGuard } from "../auth/guards";
import { CreateUserHobbiesDto } from "../user-hobbies/dto/create-user-hobbies.dto";
import { DeleteUserHobbiesDto } from "../user-hobbies/dto/delete-user-hobbies.dto";
import { CreateUserDto, PhoneUserDto, UpdateUserDto } from "./dto";
import { UsersService } from "./users.service";

@Controller("users")
@ApiTags("users")
//@UseGuards(JwtAuthGuard)
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

  @Put("update")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update user profile by user-id (user)" })
  @ApiOkResponse({ description: "User has been updated." })
  @ApiNotAcceptableResponse({
    description: "Request is not in correct form.",
  })
  @ApiNotFoundResponse({
    description: "User id not found.",
  })
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
        name: { type: "string", nullable: true },
        birthday: { type: "string", nullable: true },
        gender: { type: "string", nullable: true },
        description: { type: "string", nullable: true },
        children: { type: "integer", minimum: 0, nullable: true },
        alcohol: { type: "string", nullable: true },
        religion: { type: "string", nullable: true },
        height: { type: "integer", minimum: 0, nullable: true },
        maritalStatus: { type: "string", nullable: true },
        education: { type: "string", nullable: true },
        purposeId: { type: "string", format: "uuid", nullable: true },
        type: { type: "string" },
      },
    },
  })
  updateUserProfileById(
    @GetUser("id") userId: string,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.usersService.updateUserProfileById(userId, dto, file);
  }

  @Get("private/user-profile")
  @UseGuards(JwtAuthGuard)
  getUserProfile(@GetUser("id") userId: string) {
    return this.usersService.getUserProfile(userId);
  }

  @Post("hobbies")
  @UseGuards(JwtAuthGuard)
  createUserHobby(
    @GetUser("id") userId: string,
    @Body() dto: CreateUserHobbiesDto
  ) {
    return this.usersService.createUserHobby(userId, dto.name);
  }

  @Delete("hobbies")
  @UseGuards(JwtAuthGuard)
  deleteUserHobby(
    @GetUser("id") userId: string,
    @Body() dto: DeleteUserHobbiesDto
  ) {
    return this.usersService.deleteUserHobby(userId, dto.id);
  }

  // @Delete(":userId")
  // @ApiOperation({ summary: "Delete user data (admin)" })
  // @ApiOkResponse({ description: "User has been deleted." })
  // @ApiNotAcceptableResponse({
  //   description: "Request is not in correct form.",
  // })
  // @ApiNotFoundResponse({
  //   description: "User id not found.",
  // })
  // deleteUserProfileById(
  //   @Param("userId") userId: string,
  //   @Body() dto: DeleteUserDto
  // ) {
  //   return this.usersService.deleteUserProfileById(userId, dto);
  // }

  @Get("friends")
  @ApiOperation({ summary: "Get friends list (user)" })
  @ApiOkResponse({ description: "Matching friends list." })
  getListFriends(@GetUser("id") userId: string) {
    return this.usersService.getListFriends(userId);
  }

  @Post("update-dream-team")
  async updateUserAfterVerifyPhone(@Body() data: CreateUserDto) {
    return await this.usersService.updateUserAfterVerifyOTP(data);
  }
}
