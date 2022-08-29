import { Body, Controller, Delete, Get, Post, UseGuards } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
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
import { BlockedGuard } from "../auth/guards/blocked.guard";
import { CreateUserLikeStackDto } from "./dto/create-user-like-stack.dto";
import { DeleteUserLikeStackDto } from "./dto/delete-user-like-stacks.dto";
import { UserLikeStacksService } from "./user-like-stacks.service";

@Controller("secure/user-like-stacks")
@ApiTags("user-like-stacks")
export class UserLikeStacksController {
  constructor(private readonly userLikeStacksService: UserLikeStacksService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, BlockedGuard)
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
  @UseGuards(JwtAuthGuard, BlockedGuard)
  @ApiBearerAuth()
  findOne(@GetUser("id") userId: string) {
    return this.userLikeStacksService.getMatchingFriends(userId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard, BlockedGuard)
  @ApiBearerAuth()
  delete(@Body() body: DeleteUserLikeStackDto) {
    return this.userLikeStacksService.remove(body);
  }
}
