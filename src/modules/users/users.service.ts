import { IUserService } from "./interfaces/user-service.interface";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "./entities/user.entity";
import { InjectMapper } from "@automapper/nestjs";
import { InjectRepository } from "@nestjs/typeorm";
import { Mapper } from "@automapper/core";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { CreateUserDto } from "./dto/create-user.dto";
import { ExistedException } from "src/exceptions/existed.exception";
import { hashPassword } from "src/common/helper/hash.helper";

@Injectable()
export class UsersService implements IUserService {
  findAll(): Promise<UserEntity[]> {
    throw new Error("Method not implemented.");
  }

  constructor(
    @InjectMapper() private mapper: Mapper,
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>
  ) {}

  async signUp(dto: CreateUserDto): Promise<CreateUserDto> {
    try {
      const userExisted = await this.repository.findOne({
        where: {
          email: dto.email,
          phone: dto.phone,
        },
      });
      if (userExisted) {
        throw new ExistedException(dto.email);
      }

      const uuid = uuidv4();
      const hash = hashPassword(dto.password);

      const entity = this.mapper.map(dto, CreateUserDto, UserEntity);
      await this.mapper.mapAsync(
        await this.repository.save(entity),
        UserEntity,
        CreateUserDto
      );

      await this.repository.save({
        id: uuid,
        ...entity,
        password: hash,
      });
      return uuid;
    } catch (error) {
      throw new Error(`Register error: ${error.message}.`);
    }
  }
}
