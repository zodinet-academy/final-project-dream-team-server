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
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Injectable()
export class AdminsService implements IAdminsService {
  constructor(
    private readonly adminsRepository: AdminsRepository,
    private readonly cloudinaryService: CloudinaryService
  ) {}

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
      if (!adminData)
        return responseData(null, "Admin not found", ERROR_DATA_NOT_FOUND);

      return responseData(adminData);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async getAdminProfile(
    id: string
  ): Promise<ResponseDto<IAdminEntity | string>> {
    try {
      const res = await this.findOne(id);
      if (!res.status) return res;

      const adminData = res.data as IAdminEntity;
      const avatarUrl = await this.cloudinaryService.getImageUrl(
        adminData.avatar
      );

      const result = {
        id: adminData.id,
        name: adminData.name,
        email: adminData.email,
        avatar: avatarUrl,
        username: adminData.username,
      };

      return responseData(result);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async update(
    id: string,
    updateAdminDto: UpdateAdminsDto,
    file: Express.Multer.File
  ): Promise<ResponseDto<IAdminEntity | string>> {
    try {
      const findData = await this.findOne(id);
      if (!findData.status) return findData;
      const data = findData.data as IAdminEntity;

      if (file) {
        const res = await this.cloudinaryService.uploadImage(
          file,
          "avatar",
          data.avatar
        );

        if ("public_id" in res) {
          data.avatar = res.public_id;
        }
      }
      const resultUpdate = await this.adminsRepository.save({
        ...data,
        ...updateAdminDto,
      });

      const avatarUrl = await this.cloudinaryService.getImageUrl(
        resultUpdate.avatar
      );
      resultUpdate.avatar = avatarUrl;

      return responseData({
        username: resultUpdate.username,
        name: resultUpdate.name,
        avatar: resultUpdate.avatar,
        id: resultUpdate.id,
        email: resultUpdate.email,
      });
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
