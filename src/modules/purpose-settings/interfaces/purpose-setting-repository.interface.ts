import { CommonRepository } from "../../../common/repository";
import { PurposeSettingEntity } from "../entities/purpose-setting.entity";

export interface IUserRepository
  extends CommonRepository<PurposeSettingEntity> {
  pagination(fullName: string): Promise<PurposeSettingEntity>;
}
