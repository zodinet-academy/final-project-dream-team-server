import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
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
import { imageFileFilter } from "../../common/helper/imageFilter.helper";
import { ResponseDto } from "../../common/response.dto";
import { responseData } from "../../common/utils";
import { GetUser } from "../auth/decorator";
import { JwtAuthGuard } from "../auth/guards";
import {
  CreateUserHobbiesDto,
  DeleteUserHobbiesDto,
} from "../user-hobbies/dto";
import { ChangeFavoriteImageDto, UserImagesDto } from "../user-images/dto";
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

  @Put("secure/update")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update user profile by user-id (user)" })
  @ApiOkResponse({ description: "User has been updated." })
  @ApiNotAcceptableResponse({
    description: "Request is not in correct form.",
  })
  @ApiNotFoundResponse({
    description: "User id not found.",
  })
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: imageFileFilter,
    })
  )
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

  @Get("secure/user-profile")
  @UseGuards(JwtAuthGuard)
  getUserProfile(@GetUser("id") userId: string) {
    return this.usersService.getUserProfile(userId);
  }

  @Post("secure/hobbies")
  @UseGuards(JwtAuthGuard)
  createUserHobby(
    @GetUser("id") userId: string,
    @Body() dto: CreateUserHobbiesDto
  ) {
    return this.usersService.createUserHobby(userId, dto.name);
  }

  @Delete("secure/hobbies")
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

  @Post("secure/up-images")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Upload images for user" })
  @ApiOkResponse({ description: "Save images successfully" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FilesInterceptor("images", undefined, {
      fileFilter: imageFileFilter,
    })
  )
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        images: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
  })
  upImages(
    @GetUser("id") userId: string,
    @UploadedFiles()
    images: Array<Express.Multer.File>
  ): Promise<ResponseDto<string | UserImagesDto[]>> {
    return this.usersService.addImages(userId, images);
  }

  @Post("secure/change-image-favorite")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Change image favorite" })
  @ApiOkResponse({ description: "Change image favorite success" })
  changeImageFavorie(
    @GetUser("id") userId: string,
    @Body() dto: ChangeFavoriteImageDto
  ): Promise<ResponseDto<string | UserImagesDto>> {
    return this.usersService.changeImageFavorite(dto.id, userId);
  }

  @Delete("secure/delete-image")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Change image favorite" })
  @ApiOkResponse({ description: "Change image favorite success" })
  deleteImage(
    @GetUser("id") userId: string,
    @Body() dto: ChangeFavoriteImageDto
  ): Promise<ResponseDto<string>> {
    return this.usersService.deleteImage(userId, dto.id);
  }

  @Get("secure/friend-profile/:id")
  @UseGuards(JwtAuthGuard)
  getFriendProfile(@Param("id") id: string) {
    return this.usersService.getUserProfile(id);
  }
}
