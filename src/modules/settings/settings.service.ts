import { SettingsRepository } from "./settings.repositoty";
import { ISettingService } from "./interfaces/settings-service.interface";
import { Injectable } from "@nestjs/common";
import { CreateSettingDto } from "./dto/create-setting.dto";
import { UpdateSettingDto } from "./dto/update-setting.dto";
import { ResponseDto } from "../../common/response.dto";
import { SettingEntity } from "./entities/setting.entity";
import { getDataError, getDataSuccess } from "../../common/utils";
import {
  ERROR_DATA_EXISTED_PLEASE_USING_UPDATE,
  ERROR_DATA_NOT_FOUND,
  ERROR_UNKNOW,
} from "../../constants/code-response.constant";

@Injectable()
export class SettingsService implements ISettingService {
  constructor(private settingsRepository: SettingsRepository) {}

  /**
   *
   * @param createSettingDto
   * @returns return created setting
   */
  async createSetting(
    createSettingDto: CreateSettingDto
  ): Promise<ResponseDto<SettingEntity | string>> {
    try {
      const countData = await this.settingsRepository.count({});
      if (countData === 1)
        return getDataError(false, ERROR_DATA_EXISTED_PLEASE_USING_UPDATE, "");
      const result = await this.settingsRepository.save(
        this.settingsRepository.create(createSettingDto)
      );
      return getDataSuccess(true, result);
    } catch (error) {
      return getDataError(false, ERROR_UNKNOW, error.message);
    }
  }

  /**
   *
   * @returns setting
   */
  async findSetting(): Promise<ResponseDto<SettingEntity | string>> {
    try {
      return getDataSuccess(true, await this.settingsRepository.findOne({}));
    } catch (error) {
      return getDataError(false, ERROR_UNKNOW, error.message);
    }
  }

  async updateSetting(
    updateSettingDto: UpdateSettingDto
  ): Promise<ResponseDto<string | SettingEntity>> {
    try {
      const findData = await this.settingsRepository.findOne({});
      if (!findData) return getDataError(false, ERROR_DATA_NOT_FOUND, "");
      return getDataSuccess(
        true,
        await this.settingsRepository.save({
          id: findData.id,
          ...updateSettingDto,
        })
      );
    } catch (error) {
      return getDataError(false, ERROR_UNKNOW, error.message);
    }
  }
}
