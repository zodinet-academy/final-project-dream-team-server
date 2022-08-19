import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";

import { GetUser } from "../auth/decorator";
import { JwtAuthGuard } from "../auth/guards";
import { GetFriendByUserIdAndFriendIdDto } from "./dto";
import { UserFriendsService } from "./user-friends.service";

@Controller("secure/user-friends")
@ApiTags("user-friends")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserFriendsController {
  constructor(private readonly userFriendsService: UserFriendsService) {}

  @Get("")
  @ApiResponse({ status: 200, description: "List User Friend" })
  @ApiResponse({ status: 204, description: "User Not Found" })
  @ApiResponse({ status: 400, description: "Bad Requests" })
  @ApiResponse({ status: 500, description: "Server Error" })
  async getUserFriends(@GetUser("id") userId: string) {
    return await this.userFriendsService.getUserFriendsByUserId(userId);
  }

  @Get("/:friendId")
  @ApiResponse({ status: 200, description: "Info Friend" })
  @ApiResponse({ status: 204, description: "Friend Not Found" })
  @ApiResponse({ status: 400, description: "Bad Requests" })
  @ApiResponse({ status: 500, description: "Server Error" })
  async getFriend(
    @GetUser("id") userId: string,
    @Param() dto: GetFriendByUserIdAndFriendIdDto
  ) {
    return await this.userFriendsService.getFriendByFriendIdAndFriendId(
      userId,
      dto.friendId
    );
  }
}
