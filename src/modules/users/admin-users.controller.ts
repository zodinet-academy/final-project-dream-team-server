import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { UserRolesEnum } from "../../constants/enum";
import { Roles } from "../auth/decorator";
import { JwtAuthGuard, RolesGuard } from "../auth/guards";

import { UsersService } from "./users.service";

@Controller("secure/users")
@ApiTags("users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRolesEnum.ADMIN)
@ApiBearerAuth()
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("get-all")
  getAllBasicUses() {
    return this.usersService.getAllUser();
  }

  @Get("user-profile/:id")
  getUserProfile(@Param("id") id: string) {
    return this.usersService.getUserProfile(id);
  }

  // ------- Khong duoc xoa, nho lam -----------
  // @Delete(":userId")
  // @ApiOperation({ summary: "Delete user data (admin)" })
  // @ApiOkResponse({ description: "User has been deleted." })
  // @ApiNotAcceptableResponse({
  //   description: "Request is not in correct form.",
  // })
  // @ApiNotFoundResponse({
  //   description: "User id not found.",
  // })
  // deleteUserProfileById(
  //   @Param("userId") userId: string,
  //   @Body() dto: DeleteUserDto
  // ) {
  //   return this.usersService.deleteUserProfileById(userId, dto);
  // }
}
