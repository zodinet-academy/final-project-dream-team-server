import { ISystemUsersService } from "./interfaces/system-users-service.interface";
import {
  hashPasswords,
  comparePassword,
} from "./../../common/helper/hash.helper";
import { SystemUsersRepository } from "./system-users.repository";
import { Injectable } from "@nestjs/common";
import { getDataError, getDataSuccess } from "../../common/utils";
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
      return getDataSuccess(true, result);
    } catch (error) {
      return getDataError(false, ERROR_UNKNOW, error.message);
    }
  }

  async findAll(): Promise<ResponseDto<ISystemUserEntity[] | string>> {
    try {
      return getDataSuccess(true, await this.systemUsersRepository.find({}));
    } catch (error) {
      return getDataError(false, ERROR_UNKNOW, error.message);
    }
  }

  async findOne(
    id: string
  ): Promise<ResponseDto<ISystemUserEntity | undefined | string>> {
    try {
      return getDataSuccess(
        true,
        await this.systemUsersRepository.findByIds([id])
      );
    } catch (error) {
      return getDataError(false, ERROR_UNKNOW, error.message);
    }
  }

  async update(
    id: string,
    updateSystemUserDto: UpdateSystemUserDto
  ): Promise<ResponseDto<ISystemUserEntity | string>> {
    try {
      const findData = await this.findOne(id);
      if (!findData.status) return findData;
      if (!findData.data) return getDataError(false, ERROR_DATA_NOT_FOUND, "");
      const data = findData.data as ISystemUserEntity;
      return getDataSuccess(
        true,
        await this.systemUsersRepository.save({
          id: data.id,
          ...updateSystemUserDto,
        })
      );
    } catch (error) {
      return getDataError(false, ERROR_UNKNOW, error.message);
    }
  }

  async remove(id: string): Promise<ResponseDto<string>> {
    try {
      await this.systemUsersRepository.softDelete(id);
      return getDataSuccess(true, DATA_DELETED);
    } catch (error) {
      return getDataError(false, ERROR_UNKNOW, error.message);
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
