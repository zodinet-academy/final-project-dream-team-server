import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
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
import { CreateUserBlockDto } from "./dto/create-user-block.dto";
import { UserBlocksService } from "./user-blocks.service";

@Controller("user-blocks")
@ApiTags("user-blocks")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserBlocksController {
  constructor(private readonly userBlocksService: UserBlocksService) {}

  @Post()
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
    @Body() createUserBlockDto: CreateUserBlockDto
  ) {
    return this.userBlocksService.create(userId, createUserBlockDto);
  }

  @Get()
  @ApiOperation({ summary: "get list blocked users by user" })
  @ApiOkResponse({ description: "list blocked user" })
  @ApiNotAcceptableResponse({
    description: "Request is not in correct form.",
  })
  @ApiNotFoundResponse({
    description: "User id not found.",
  })
  findAll(@GetUser("id") userId: string) {
    return this.userBlocksService.getAllBlockedUser(userId);
  }
}
