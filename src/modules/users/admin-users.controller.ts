import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

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

  @Get("get-detail/:id")
  getDetail(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.getUserProfile(id);
  }

  @Post("block/:id")
  blockUser(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.blockUser(id);
  }

  @Post("unblock/:id")
  unblockUser(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.unblockUser(id);
  }

  // @Delete(":userId")
  // @ApiOperation({ summary: "Delete user data (admin)" })
  // @ApiOkResponse({ description: "User has been deleted." })
  // @ApiNotAcceptableResponse({
  // 	description: "Request is not in correct form.",
  // })
  // @ApiNotFoundResponse({
  // 	description: "User id not found.",
  // })
  // deleteUserProfileById(@Param("userId") userId: string) {
  // 	return this.usersService.deleteUserProfileById(userId);
  // }
}
