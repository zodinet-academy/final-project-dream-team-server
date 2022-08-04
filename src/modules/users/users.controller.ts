import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { GetUser } from "../auth/decorator";
import { JwtGuard } from "../auth/guards";
import { UsersService } from "./users.service";

@Controller("users")
@ApiTags("users")
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @Get("user-friends")
  getListFriends(@GetUser("id") id: string) {
    console.log(id);
    return "hello";
    //return this.usersService.getListFriends(id);
  }
}
