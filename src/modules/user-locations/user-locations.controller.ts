import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { GetUser, Roles } from "../auth/decorator";
import { JwtAuthGuard, RolesGuard } from "../auth/guards";
import { CreateUserLocationDto } from "./dto/create-user-location.dto";
import { UserLocationsService } from "./user-locations.service";

@Controller("user-locations")
@ApiTags("user_locations")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(UserRolesEnum.USER)
export class UserLocationsController {
  constructor(private readonly userLocationsService: UserLocationsService) {}

  @Post()
  @ApiOperation({ summary: "create user locations " })
  @ApiOkResponse({ description: "user locations created" })
  @ApiNotAcceptableResponse({
    description: "Request is not in correct form.",
  })
  @ApiNotFoundResponse({
    description: "User id not found.",
  })
  create(
    @GetUser("userId") userId: string,
    @Body() createUserLocationDto: CreateUserLocationDto
  ) {
    return this.userLocationsService.createOrUpdate(
      userId,
      createUserLocationDto
    );
  }

  @Get()
  @ApiOperation({ summary: "find user locations near user" })
  @ApiOkResponse({ description: "list user locations" })
  @ApiNotAcceptableResponse({
    description: "Request is not in correct form.",
  })
  @ApiNotFoundResponse({
    description: "User id not found.",
  })
  findAllByDistance(@GetUser("userId") userId: string) {
    return this.userLocationsService.findAllByDistance(userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userLocationsService.findOne(+id);
  }
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userLocationsService.remove(+id);
  }
}
