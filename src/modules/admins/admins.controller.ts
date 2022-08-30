import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { imageFileFilter } from "../../common/helper/imageFilter.helper";
import { UserRolesEnum } from "../../constants/enum";
import { GetUser, Roles } from "../auth/decorator";
import { JwtAuthGuard, RolesGuard } from "../auth/guards";
import { AdminsService } from "./admins.service";
import { CreateAdminsDto } from "./dto/create-admins.dto";
import { UpdateAdminsDto } from "./dto/update-admins.dto";

@Controller("secure/admins")
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

  @Get("get-current-admin")
  findOne(@GetUser("id") id: string) {
    return this.adminsService.getAdminProfile(id);
  }

  @Put()
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: imageFileFilter,
    })
  )
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
        email: { type: "string", nullable: true },
        name: { type: "string", nullable: true },
      },
    },
  })
  update(
    @GetUser("id") adminId: string,
    @Body() adminsUserDto: UpdateAdminsDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.adminsService.update(adminId, adminsUserDto, file);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.adminsService.remove(id);
  }
}
