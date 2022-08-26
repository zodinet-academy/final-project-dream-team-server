import { SettingsRepository } from "./settings.repositoty";
import { Injectable } from "@nestjs/common";
import { CreateSettingDto } from "./dto/create-setting.dto";
import { UpdateSettingDto } from "./dto/update-setting.dto";
import { ResponseDto } from "../../common/response.dto";
import { SettingEntity } from "./entities/setting.entity";
import { responseData } from "../../common/utils";
import {
  ERROR_DATA_EXISTED_PLEASE_USING_UPDATE,
  ERROR_DATA_NOT_FOUND,
  ERROR_UNKNOWN,
} from "../../constants/code-response.constant";
import { ISettingService } from "./interfaces";

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
        return responseData(null, null, ERROR_DATA_EXISTED_PLEASE_USING_UPDATE);
      const result = await this.settingsRepository.save(
        this.settingsRepository.create(createSettingDto)
      );
      return responseData(result);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  /**
   *
   * @returns setting
   */
  async findSetting(): Promise<ResponseDto<SettingEntity | string>> {
    try {
      return responseData(await this.settingsRepository.findOne({}));
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  /**
   * update setting
   * @param updateSettingDto
   * @returns setting after updated
   */
  async updateSetting(
    updateSettingDto: UpdateSettingDto
  ): Promise<ResponseDto<string | SettingEntity>> {
    try {
      const findData = await this.settingsRepository.findOne({});
      if (!findData) return responseData(null, null, ERROR_DATA_NOT_FOUND);
      return responseData(
        await this.settingsRepository.save({
          id: findData.id,
          ...updateSettingDto,
        })
      );
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }
}
