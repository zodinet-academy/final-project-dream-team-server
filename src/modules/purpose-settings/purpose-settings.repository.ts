import { EntityRepository, Repository } from "typeorm";
import { PurposeSettingEntity } from "./entities/purpose-setting.entity";

@EntityRepository(PurposeSettingEntity)
export class PurposeSettingsRepository extends Repository<PurposeSettingEntity> {}
