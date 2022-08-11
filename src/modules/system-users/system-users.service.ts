import { ISystemUsersService } from "./interfaces/system-users-service.interface";
import {
  hashPasswords,
  comparePassword,
} from "./../../common/helper/hash.helper";
import { SystemUsersRepository } from "./system-users.repository";
import { Injectable } from "@nestjs/common";
import { responseData } from "../../common/utils";
import {
  DATA_DELETED,
  ERROR_DATA_NOT_FOUND,
  ERROR_UNKNOW,
} from "../../constants/code-response.constant";
import { CreateSystemUserDto } from "./dto/create-system-user.dto";
import { UpdateSystemUserDto } from "./dto/update-system-user.dto";
import { ResponseDto } from "../../common/response.dto";
import { ISystemUserEntity } from "./interfaces/system-user-entity.interface";
import { AdminLoginDto } from "../auth/dto/admin-login.dto";

@Injectable()
export class SystemUsersService implements ISystemUsersService {
  constructor(private readonly systemUsersRepository: SystemUsersRepository) {}

  async create(
    createSystemUserDto: CreateSystemUserDto
  ): Promise<ResponseDto<ISystemUserEntity | string>> {
    try {
      createSystemUserDto.password = hashPasswords(
        createSystemUserDto.password
      );
      const result = await this.systemUsersRepository.save(
        this.systemUsersRepository.create(createSystemUserDto)
      );
      return responseData(result);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOW);
    }
  }

  async findAll(): Promise<ResponseDto<ISystemUserEntity[] | string>> {
    try {
      return responseData(await this.systemUsersRepository.find({}));
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOW);
    }
  }

  async findOne(
    id: string
  ): Promise<ResponseDto<ISystemUserEntity | undefined | string>> {
    try {
      return responseData(await this.systemUsersRepository.findByIds([id]));
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOW);
    }
  }

  async update(
    id: string,
    updateSystemUserDto: UpdateSystemUserDto
  ): Promise<ResponseDto<ISystemUserEntity | string>> {
    try {
      const findData = await this.findOne(id);
      if (!findData.status) return findData;
      if (!findData.data) return responseData(null, null, ERROR_DATA_NOT_FOUND);
      const data = findData.data as ISystemUserEntity;
      return responseData(
        await this.systemUsersRepository.save({
          id: data.id,
          ...updateSystemUserDto,
        })
      );
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOW);
    }
  }

  async remove(id: string): Promise<ResponseDto<string>> {
    try {
      await this.systemUsersRepository.softDelete(id);
      return responseData(DATA_DELETED);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOW);
    }
  }

  async findByUsernameAndPassword(
    adminLoginDto: AdminLoginDto
  ): Promise<ISystemUserEntity | undefined> {
    const findData = await this.systemUsersRepository.findOne({
      where: {
        username: adminLoginDto.username,
      },
    });
    const isMatch = await comparePassword(
      adminLoginDto.password,
      findData?.password
    );
    return isMatch ? findData : undefined;
  }
}
