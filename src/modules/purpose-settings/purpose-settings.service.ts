import { PurposeSettingEntity } from "./entities/purpose-setting.entity";
import { PurposeSettingsRepository } from "./purpose-settings.repository";
import { Injectable } from "@nestjs/common";
import { CreatePurposeSettingDto } from "./dto/create-purpose-setting.dto";
import { UpdatePurposeSettingDto } from "./dto/update-purpose-setting.dto";
import { responseData } from "../../common/utils";
import {
  DATA_DELETED,
  ERROR_DATA_NOT_FOUND,
  ERROR_UNKNOWN,
} from "../../constants/code-response.constant";
import { ResponseDto } from "../../common/response.dto";
import { IPurposeSettingsService } from "./interfaces";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { ResponsePurposeSettingDto } from "./dto/response-purpose-setting.dto";

@Injectable()
export class PurposeSettingsService implements IPurposeSettingsService {
  constructor(
    private readonly purposeSettingsRepository: PurposeSettingsRepository,
    @InjectMapper() private readonly mapper: Mapper
  ) {}

  async create(
    createPurposeSettingDto: CreatePurposeSettingDto
  ): Promise<ResponseDto<PurposeSettingEntity | string>> {
    try {
      return responseData(
        await this.purposeSettingsRepository.save(
          this.purposeSettingsRepository.create(createPurposeSettingDto)
        )
      );
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async findAll(): Promise<ResponseDto<ResponsePurposeSettingDto[] | string>> {
    try {
      const purposes = await this.purposeSettingsRepository.find({});

      const result = this.mapper.mapArray(
        purposes,
        PurposeSettingEntity,
        ResponsePurposeSettingDto
      );

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
    updatePurposeSettingDto: UpdatePurposeSettingDto
  ): Promise<ResponseDto<PurposeSettingEntity | string>> {
    try {
      const findData = await this.findOne(id);
      if (!findData.status) return findData;
      const data = findData.data as PurposeSettingEntity;
      return responseData(
        await this.purposeSettingsRepository.save({
          id: data.id,
          ...updatePurposeSettingDto,
        })
      );
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async remove(id: string): Promise<ResponseDto<string>> {
    try {
      await this.purposeSettingsRepository.softDelete(id);
      return responseData(DATA_DELETED);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }
}
