import { ResponseDto } from "../../../common/response.dto";
import { CreatePurposeSettingDto } from "../dto/create-purpose-setting.dto";
import { ResponsePurposeSettingDto } from "../dto/response-purpose-setting.dto";
import { UpdatePurposeSettingDto } from "../dto/update-purpose-setting.dto";
import { PurposeSettingEntity } from "../entities/purpose-setting.entity";

export interface IPurposeSettingsService {
  create(
    createPurposeSettingDto: CreatePurposeSettingDto,
    file: Express.Multer.File
  ): Promise<ResponseDto<ResponsePurposeSettingDto | string>>;

  findAll(): Promise<ResponseDto<ResponsePurposeSettingDto[] | string>>;
  findOne(
    id: string
  ): Promise<ResponseDto<PurposeSettingEntity | undefined | string>>;
  update(
    id: string,
    updatePurposeSettingDto: UpdatePurposeSettingDto,
    file: Express.Multer.File
  ): Promise<ResponseDto<PurposeSettingEntity | string>>;
  remove(id: string): Promise<ResponseDto<string>>;
}
