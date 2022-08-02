import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ResponseDto } from "../../common/response.dto";
import { ExistedException } from "../../exceptions/existed.exception";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entities/user.entity";
import { IUserService } from "./interfaces/user-service.interface";
import { UserRepository } from "./user.repository";

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: UserRepository
  ) {}
  findById(id: string): Promise<ResponseDto<UserEntity>> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<UserEntity[]> {
    throw new Error("Method not implemented.");
  }
  async signUp(dto: CreateUserDto): Promise<UserEntity> {
    try {
      const userExisted = await this.userRepository.findOne({
        email: dto.email,
        phone: dto.phone,
      });
      if (userExisted) {
        throw new ExistedException(dto.email);
      }
      const result = await this.userRepository.save(
        this.userRepository.create(dto)
      );
      return result;
    } catch (error) {
      throw new Error(`Register error: ${error.message}.`);
    }
  }
}
