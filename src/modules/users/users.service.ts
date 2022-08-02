import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entities/user.entity";
import { IUserService } from "./interfaces/user-service.interface";
import { UserRepository } from "./user.repository";

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectMapper() private mapper: Mapper,
    private repository: UserRepository
  ) {}
  findAll(): Promise<UserEntity[]> {
    throw new Error("Method not implemented.");
  }
  async signUp(dto: CreateUserDto): Promise<CreateUserDto> {
    try {
      const userExisted = await this.repository.findByCondition({
        email: dto.email,
        phone: dto.phone,
      });
      if (userExisted) {
        // throw new ExistedException(dto.email);
        throw new Error("Not Found");
      }

      const uuid = uuidv4();

      const entity = this.mapper.map(dto, CreateUserDto, UserEntity);
      await this.mapper.mapAsync(
        await this.repository.save(entity),
        UserEntity,
        CreateUserDto
      );

      await this.repository.save({
        id: uuid,
        ...entity,
      });
      return uuid;
    } catch (error) {
      throw new Error(`Register error: ${error.message}.`);
    }
  }
}
