import { Body, Controller, Inject, Post } from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";

@Controller("auth")
export class AuthController {
  constructor(@Inject(UsersService) private userService: UsersService) {}

  @Post("signup")
  signupUser(@Body() dto: CreateUserDto) {
    return this.userService.signUp(dto);
  }
}
