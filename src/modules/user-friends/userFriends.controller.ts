import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "../auth/guards";
import { UserFriendsService } from "./userFriends.service";
import { GetUserFriendsDto, GetFriendByUserIdAndFriendIdDto } from "./dto";

@Controller("user-friends")
@ApiTags("user-friends")
// @UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserFriendsController {
  constructor(private readonly userFriendsService: UserFriendsService) {}

  @Get("/:userId")
  @ApiResponse({ status: 200, description: "List User Friend" })
  @ApiResponse({ status: 204, description: "User Not Found" })
  @ApiResponse({ status: 400, description: "Bad Requests" })
  @ApiResponse({ status: 500, description: "Server Error" })
  async getUserFriends(@Param() dto: GetUserFriendsDto) {
    return await this.userFriendsService.getUserFriendsByUserId(dto.userId);
  }

  @Get("/")
  @ApiResponse({ status: 200, description: "Info Friend" })
  @ApiResponse({ status: 204, description: "Friend Not Found" })
  @ApiResponse({ status: 400, description: "Bad Requests" })
  @ApiResponse({ status: 500, description: "Server Error" })
  async getFriend(@Query() dto: GetFriendByUserIdAndFriendIdDto) {
    return await this.userFriendsService.getFriendByFriendIdAndFriendId(
      dto.userId,
      dto.friendId
    );
  }
}
