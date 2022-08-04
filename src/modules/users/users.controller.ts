import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DeleteUserDto, UpdateUserDto } from "./dto";
import { UsersService } from "./users.service";

type PhoneNumber = {
  phone: string;
};
@Controller("users")
@ApiTags("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUser() {
    return this.usersService.getAllUser();
  }

  @Get(":userId")
  getPublicById(@Param("userId") userId: string) {
    return this.usersService.getPublicById(userId);
  }

  @Post("/phone")
  @ApiBearerAuth()
  getUserByPhone(@Body() phone: PhoneNumber) {
    return this.usersService.getUserByPhone(phone.phone);
  }

  @Post("/email")
  @ApiBearerAuth()
  getUserByEmail(@Body() email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Post(":userId")
  @ApiBearerAuth()
  updateUserProfileById(
    @Param("userId") userId: string,
    @Body() dto: UpdateUserDto
  ) {
    return this.usersService.updateUserProfileById(userId, dto);
  }

  @Delete(":userId")
  @ApiBearerAuth()
  deleteUserProfileById(
    @Param("userId") userId: string,
    @Body() dto: DeleteUserDto
  ) {
    return this.usersService.deleteUserProfileById(userId, dto);
  }
}
