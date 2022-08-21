import { ResponseDto } from "../../../common/response.dto";
import { CreatePurposeSettingDto } from "../dto/create-purpose-setting.dto";
import { ResponsePurposeSettingDto } from "../dto/response-purpose-setting.dto";
import { UpdatePurposeSettingDto } from "../dto/update-purpose-setting.dto";
import { PurposeSettingEntity } from "../entities/purpose-setting.entity";

export interface IPurposeSettingsService {
  create(
    createPurposeSettingDto: CreatePurposeSettingDto
  ): Promise<ResponseDto<PurposeSettingEntity | string>>;

  findAll(): Promise<ResponseDto<ResponsePurposeSettingDto[] | string>>;
  findOne(
    id: string
  ): Promise<ResponseDto<PurposeSettingEntity | undefined | string>>;
  update(
    id: string,
    updatePurposeSettingDto: UpdatePurposeSettingDto
  ): Promise<ResponseDto<PurposeSettingEntity | string>>;
  remove(id: string): Promise<ResponseDto<string>>;
}
