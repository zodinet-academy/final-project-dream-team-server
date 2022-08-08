import { SettingEntity } from "./../entities/setting.entity";
import { ResponseDto } from "../../../common/response.dto";
import { CreateSettingDto } from "../dto/create-setting.dto";
import { UpdateSettingDto } from "../dto/update-setting.dto";

export interface ISettingService {
  createSetting: (
    createSettingDto: CreateSettingDto
  ) => Promise<ResponseDto<SettingEntity | string>>;
  findSetting: () => Promise<ResponseDto<SettingEntity | string>>;
  updateSetting: (
    updateSettingDto: UpdateSettingDto
  ) => Promise<ResponseDto<SettingEntity | string>>;
}
