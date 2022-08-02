import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExistedException } from "../../exceptions/existed.exception";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entities/user.entity";
import { IUserService } from "./interfaces/user-service.interface";
import { UserRepository } from "./user.repository";

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
    @InjectMapper() private mapper: Mapper
  ) {}
  findAll(): Promise<UserEntity[]> {
    throw new Error("Method not implemented.");
  }
  async signUp(dto: CreateUserDto): Promise<CreateUserDto> {
    try {
      const userExisted = await this.repository.findOne({
        email: dto.email,
        phone: dto.phone,
      });
      if (userExisted) {
        throw new ExistedException(dto.email);
      }
      const entity = this.mapper.map(dto, CreateUserDto, UserEntity);

      await this.mapper.mapAsync(
        await this.repository.save(entity),
        UserEntity,
        CreateUserDto
      );
      return dto;
    } catch (error) {
      throw new Error(`Register error: ${error.message}.`);
    }
  }
}
