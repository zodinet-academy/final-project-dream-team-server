import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { ResponseDto } from "../../common/response.dto";
import { responseData } from "../../common/utils";
import {
  ERROR_DATA_NOT_FOUND,
  ERROR_UNKNOWN,
} from "../../constants/code-response.constant";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { CreatePurposeSettingDto } from "./dto/create-purpose-setting.dto";
import { ResponsePurposeSettingDto } from "./dto/response-purpose-setting.dto";
import { UpdatePurposeSettingDto } from "./dto/update-purpose-setting.dto";
import { PurposeSettingEntity } from "./entities/purpose-setting.entity";
import { IPurposeSettingsService } from "./interfaces";
import { PurposeSettingsRepository } from "./purpose-settings.repository";

@Injectable()
export class PurposeSettingsService implements IPurposeSettingsService {
  constructor(
    private readonly purposeSettingsRepository: PurposeSettingsRepository,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async create(
    createPurposeSettingDto: CreatePurposeSettingDto,
    file: Express.Multer.File
  ): Promise<ResponseDto<ResponsePurposeSettingDto | string>> {
    try {
      const res = await this.cloudinaryService.uploadImage(file, "icons");

      if ("public_id" in res) {
        createPurposeSettingDto.image = res.public_id;
      } else {
        return responseData(null, "Upload image fail.", ERROR_UNKNOWN);
      }

      const resultSave = await this.purposeSettingsRepository.save(
        this.purposeSettingsRepository.create(createPurposeSettingDto)
      );

      const imageUrl = await this.cloudinaryService.getImageUrl(
        resultSave.image
      );

      resultSave.image = imageUrl;

      const data = this.mapper.map(
        resultSave,
        PurposeSettingEntity,
        ResponsePurposeSettingDto
      );

      return responseData(data);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async findAll(): Promise<ResponseDto<ResponsePurposeSettingDto[] | string>> {
    try {
      const purposes = await this.purposeSettingsRepository.find({
        deletedAt: null,
      });

      const result = this.mapper.mapArray(
        purposes,
        PurposeSettingEntity,
        ResponsePurposeSettingDto
      );

      result.forEach(async (purpose) => {
        const imageUrl = await this.cloudinaryService.getImageUrl(
          purpose.image
        );
        purpose.image = imageUrl;
      });

      return responseData(result);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async findOne(
    id: string
  ): Promise<ResponseDto<PurposeSettingEntity | undefined | string>> {
    try {
      const purpose = await this.purposeSettingsRepository.findOne(id);
      if (!purpose)
        return responseData(null, "find one error", ERROR_DATA_NOT_FOUND);
      return responseData(purpose, "find one success");
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async update(
    id: string,
    updatePurposeSettingDto: UpdatePurposeSettingDto,
    file: Express.Multer.File
  ): Promise<ResponseDto<PurposeSettingEntity | string>> {
    try {
      const findData = await this.findOne(id);
      if (!findData.status) return findData;
      const data = findData.data as PurposeSettingEntity;

      if (file) {
        const res = await this.cloudinaryService.uploadImage(
          file,
          "icons",
          data.image
        );

        if ("public_id" in res) {
          updatePurposeSettingDto.image = res.public_id;
        } else {
          return responseData(null, "Upload image fail.", ERROR_UNKNOWN);
        }
      } else {
        updatePurposeSettingDto.image = data.image;
      }

      const resultUpdate = await this.purposeSettingsRepository.save({
        id: data.id,
        ...updatePurposeSettingDto,
      });

      if ("image" in resultUpdate) {
        const imageUrl = await this.cloudinaryService.getImageUrl(
          resultUpdate.image
        );

        resultUpdate.image = imageUrl;
      }
      return responseData(resultUpdate);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async remove(id: string): Promise<ResponseDto<string>> {
    try {
      await this.purposeSettingsRepository.softDelete(id);
      return responseData(id);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }
}
