import { EntityRepository, Repository } from "typeorm";
import { SettingEntity } from "./entities/setting.entity";
import { ISettingsRepository } from "./setting-repository.interface";
@EntityRepository(SettingEntity)
export class SettingsRepository
  extends Repository<SettingEntity>
  implements ISettingsRepository {
  pagination: () => Promise<any>;
}
