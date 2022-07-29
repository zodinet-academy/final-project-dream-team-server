import { GetAllUsersUseCase } from './../../../use-cases/user/get-all-users.use-case/get-all-users.use-case';
import { CreateUserUseCase } from '../../../use-cases/user/create-user-use-case/create-user-use-case';
import { CreateUserDto } from './../../../shared/dtos/user/create-user.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase, private readonly getAllUsersUseCase: GetAllUsersUseCase) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Get()
  findAll() {
    return this.getAllUsersUseCase.execute();
  }
}
