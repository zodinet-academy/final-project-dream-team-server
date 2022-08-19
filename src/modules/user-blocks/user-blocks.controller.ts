import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { UserBlocksService } from "./user-blocks.service";
import { CreateUserBlockDto } from "./dto/create-user-block.dto";
import { UpdateUserBlockDto } from "./dto/update-user-block.dto";

@Controller("user-blocks")
export class UserBlocksController {
  constructor(private readonly userBlocksService: UserBlocksService) {}

  @Post()
  create(@Body() createUserBlockDto: CreateUserBlockDto) {
    return this.userBlocksService.create(createUserBlockDto);
  }

  @Get()
  findAll() {
    return this.userBlocksService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userBlocksService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateUserBlockDto: UpdateUserBlockDto
  ) {
    return this.userBlocksService.update(+id, updateUserBlockDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userBlocksService.remove(+id);
  }
}
