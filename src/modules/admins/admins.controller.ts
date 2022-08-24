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
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { UserRolesEnum } from "../../constants/enum";
import { Roles } from "../auth/decorator";
import { JwtAuthGuard, RolesGuard } from "../auth/guards";
import { AdminsService } from "./admins.service";
import { CreateAdminsDto } from "./dto/create-admins.dto";
import { UpdateAdminsDto } from "./dto/update-admins.dto";

@Controller("admins")
@ApiTags("admins")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(UserRolesEnum.ADMIN)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  create(@Body() createAdmisDto: CreateAdminsDto) {
    return this.adminsService.create(createAdmisDto);
  }

  @Get()
  findAll() {
    return this.adminsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.adminsService.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() adminsUserDto: UpdateAdminsDto) {
    return this.adminsService.update(id, adminsUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.adminsService.remove(id);
  }
}
