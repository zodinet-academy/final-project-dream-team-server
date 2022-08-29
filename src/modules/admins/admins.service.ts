import {
  hashPasswords,
  comparePassword,
} from "../../common/helper/hash.helper";
import { Injectable } from "@nestjs/common";
import { responseData } from "../../common/utils";
import {
  DATA_DELETED,
  ERROR_DATA_NOT_FOUND,
  ERROR_UNKNOWN,
} from "../../constants/code-response.constant";

import { ResponseDto } from "../../common/response.dto";
import { AdminLoginDto } from "../auth/dto/admin-login.dto";
import { AdminsRepository } from "./admins.repository";
import { IAdminEntity, IAdminsService } from "./interfaces";
import { CreateAdminsDto } from "./dto/create-admins.dto";
import { UpdateAdminsDto } from "./dto/update-admins.dto";

@Injectable()
export class AdminsService implements IAdminsService {
  constructor(private readonly adminsRepository: AdminsRepository) {}

  async create(
    createAdminsDto: CreateAdminsDto
  ): Promise<ResponseDto<IAdminEntity | string>> {
    try {
      createAdminsDto.password = hashPasswords(createAdminsDto.password);
      const result = await this.adminsRepository.save(
        this.adminsRepository.create(createAdminsDto)
      );
      return responseData(result);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async findAll(): Promise<ResponseDto<IAdminEntity[] | string>> {
    try {
      return responseData(await this.adminsRepository.find({}));
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async findOne(
    id: string
  ): Promise<ResponseDto<IAdminEntity | undefined | string>> {
    try {
      const adminData = await this.adminsRepository.findOne(id);
      const result = {
        id: adminData.id,
        name: adminData.name,
        email: adminData.email,
        avatar: adminData.avatar,
      };

      return responseData(result);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async update(
    id: string,
    updateAdminDto: UpdateAdminsDto
  ): Promise<ResponseDto<IAdminEntity | string>> {
    try {
      const findData = await this.findOne(id);
      if (!findData.status) return findData;
      if (!findData.data) return responseData(null, null, ERROR_DATA_NOT_FOUND);
      const data = findData.data as IAdminEntity;
      return responseData(
        await this.adminsRepository.save({
          id: data.id,
          ...updateAdminDto,
        })
      );
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async remove(id: string): Promise<ResponseDto<string>> {
    try {
      await this.adminsRepository.softDelete(id);
      return responseData(DATA_DELETED);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async findByUsernameAndPassword(
    adminLoginDto: AdminLoginDto
  ): Promise<IAdminEntity | undefined> {
    const findData = await this.adminsRepository.findOne({
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
