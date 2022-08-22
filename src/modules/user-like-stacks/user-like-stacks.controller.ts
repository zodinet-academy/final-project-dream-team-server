import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { UserLikeStacksService } from "./user-like-stacks.service";
import { CreateUserLikeStackDto } from "./dto/create-user-like-stack.dto";
import { UpdateUserLikeStackDto } from "./dto/update-user-like-stack.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import { GetUser } from "../auth/decorator";
import { JwtAuthGuard } from "../auth/guards";

@Controller("secure/user-like-stacks")
@ApiTags("user-like-stacks")
export class UserLikeStacksController {
  constructor(private readonly userLikeStacksService: UserLikeStacksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create user - blocked user" })
  @ApiOkResponse({ description: "user blocked entity" })
  @ApiNotAcceptableResponse({
    description: "Request is not in correct form.",
  })
  @ApiNotFoundResponse({
    description: "User id not found.",
  })
  create(
    @GetUser("id") userId: string,
    @Body() createUserLikeStackDto: CreateUserLikeStackDto
  ) {
    return this.userLikeStacksService.create(userId, createUserLikeStackDto);
  }

  @Get()
  findAll() {
    return this.userLikeStacksService.matchFriend();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userLikeStacksService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateUserLikeStackDto: UpdateUserLikeStackDto
  ) {
    return this.userLikeStacksService.update(+id, updateUserLikeStackDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userLikeStacksService.remove(+id);
  }
}
