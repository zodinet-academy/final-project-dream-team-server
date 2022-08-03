import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { VerifyUserDto } from "./dto/verify-user.dto";
import { UsersService } from "./users.service";

@Controller()
@ApiTags("users")
export class PublicUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("signup")
  signupUser(@Body() dto: CreateUserDto) {
    return this.usersService.signUp(dto);
  }

  @Post("verify-user")
  verifyUser(@Body() dto: VerifyUserDto) {
    return this.usersService.verifyUser(dto);
  }
}
