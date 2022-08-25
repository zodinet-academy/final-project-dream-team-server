import {
  Body,
  Controller,
  Delete,
  Get,
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
import { UserRolesEnum } from "../../constants/enum";
import { GetUser, Roles } from "../auth/decorator";
import { JwtAuthGuard, RolesGuard } from "../auth/guards";
import {
  CreateUserHobbiesDto,
  DeleteUserHobbiesDto,
} from "../user-hobbies/dto";
import { ChangeFavoriteImageDto, UserImagesDto } from "../user-images/dto";
import { UpdateUserDto } from "./dto";
import { UsersService } from "./users.service";

@Controller("secure/users")
@ApiTags("users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRolesEnum.USER)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put("update")
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

  @Get("user-profile")
  getUserProfile(@GetUser("id") userId: string) {
    return this.usersService.getUserProfile(userId);
  }

  @Post("hobbies")
  createUserHobby(
    @GetUser("id") userId: string,
    @Body() dto: CreateUserHobbiesDto
  ) {
    return this.usersService.createUserHobby(userId, dto.name);
  }

  @Delete("hobbies")
  deleteUserHobby(
    @GetUser("id") userId: string,
    @Body() dto: DeleteUserHobbiesDto
  ) {
    return this.usersService.deleteUserHobby(userId, dto.id);
  }

  @Post("upload-images")
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

  @Post("change-image-favorite")
  @ApiOperation({ summary: "Change image favorite" })
  @ApiOkResponse({ description: "Change image favorite success" })
  changeImageFavorie(
    @GetUser("id") userId: string,
    @Body() dto: ChangeFavoriteImageDto
  ): Promise<ResponseDto<string | UserImagesDto>> {
    return this.usersService.changeImageFavorite(dto.id, userId);
  }

  @Delete("delete-image")
  @ApiOperation({ summary: "Change image favorite" })
  @ApiOkResponse({ description: "Change image favorite success" })
  deleteImage(
    @GetUser("id") userId: string,
    @Body() dto: ChangeFavoriteImageDto
  ): Promise<ResponseDto<string>> {
    return this.usersService.deleteImage(userId, dto.id);
  }

  @Get("friend-profile/:id")
  getFriendProfile(@Param("id") id: string) {
    return this.usersService.getUserProfile(id);
  }
}
