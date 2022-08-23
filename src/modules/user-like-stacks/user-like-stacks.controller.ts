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
import { GetUser } from "../auth/decorator";
import { JwtAuthGuard } from "../auth/guards";
import { CreateUserLikeStackDto } from "./dto/create-user-like-stack.dto";
import { UserLikeStacksService } from "./user-like-stacks.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { DeleteUserLikeStackDto } from "./dto/delete-user-like-stacks.dto";

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

  @Cron(CronExpression.EVERY_MINUTE)
  matchFriend() {
    return this.userLikeStacksService.matchFriends();
  }

  @Get("matching-friends")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@GetUser("id") userId: string) {
    return this.userLikeStacksService.getMatchingFriends(userId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  delete(@Body() body: DeleteUserLikeStackDto) {
    return this.userLikeStacksService.remove(body);
  }
}
