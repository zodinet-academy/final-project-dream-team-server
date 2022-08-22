import { AutoMap } from "@automapper/classes";
import { IPurposeSettingsEntity } from "../interfaces";

export class ResponsePurposeSettingDto implements IPurposeSettingsEntity {
  @AutoMap()
  id: string;

  @AutoMap()
  title: string;

  @AutoMap()
  description: string;

  @AutoMap()
  image: string;
}
