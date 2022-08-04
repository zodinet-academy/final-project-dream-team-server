import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { UserId } from "./dto/response-friend.dto";
import { MatchingUsersService } from "./matching-users.service";

@ApiTags("matching-users")
@Controller("matching-users")
export class MatchingUsersController {
  constructor(private matchingUsersService: MatchingUsersService) {}

  @Post()
  async getListFrinedsId(@Body() data: UserId) {
    return await this.matchingUsersService.getListFriendsId(data.id);
  }
}
