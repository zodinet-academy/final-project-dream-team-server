import { PartialType } from "@nestjs/swagger";
import { CreatePurposeSettingDto } from "./create-purpose-setting.dto";

export class UpdatePurposeSettingDto extends PartialType(
  CreatePurposeSettingDto
) {}
