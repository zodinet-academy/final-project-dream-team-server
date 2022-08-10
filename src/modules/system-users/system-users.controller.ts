import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRoles } from "../../constants";
import { Roles } from "../auth/decorator";
import { JwtAuthGuard, RolesGuard } from "../auth/guards";
import { CreateSystemUserDto } from "./dto/create-system-user.dto";
import { UpdateSystemUserDto } from "./dto/update-system-user.dto";
import { SystemUsersService } from "./system-users.service";

@Controller("system-users")
@ApiTags("system_users")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(UserRoles.ADMIN)
export class SystemUsersController {
  constructor(private readonly systemUsersService: SystemUsersService) {}

  @Post()
  create(@Body() createSystemUserDto: CreateSystemUserDto) {
    return this.systemUsersService.create(createSystemUserDto);
  }

  @Get()
  findAll() {
    return this.systemUsersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.systemUsersService.findOne(id);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updateSystemUserDto: UpdateSystemUserDto
  ) {
    return this.systemUsersService.update(id, updateSystemUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.systemUsersService.remove(id);
  }
}
