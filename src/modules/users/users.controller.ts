import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";

@Controller("users")
@ApiTags("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":userId")
  @ApiBearerAuth()
  getPublicById(@Param("userId") userId: string) {
    return this.usersService.getPublicById(userId);
  }

  @Post("/phone")
  getUserByPhone(@Body() phone: string) {
    return this.usersService.getUserByPhone(phone);
  }

  @Post("/email")
  getUserByEmail(@Body() email: string) {
    return this.usersService.getUserByEmail(email);
  }
}
