import { ApiPropertyOptional, PickType } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import {
  AlcoholEnum,
  EducationEnum,
  GenderEnum,
  MaritalStatusEnum,
  ReligionEnum,
  UpdateUserProfileEnum,
} from "../../../constants/enum";
import { IUserEntity } from "../interfaces";

export class UpdateUserDto implements IUserEntity {
  @ApiPropertyOptional({ description: "name" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: "birthday" })
  @IsOptional()
  birthday?: Date;

  @ApiPropertyOptional({
    description: "gender",
    enum: GenderEnum,
    default: GenderEnum.FEMALE,
  })
  @IsOptional()
  @IsString()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;

  @ApiPropertyOptional({
    description: "description",
    default: "This is my description",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: "children", default: "0" })
  @IsOptional()
  @IsNumberString()
  children?: number;

  @ApiPropertyOptional({
    description: "alcohol",
    enum: AlcoholEnum,
    default: AlcoholEnum.NEVER,
  })
  @IsOptional()
  @IsString()
  @IsEnum(AlcoholEnum)
  alcohol?: AlcoholEnum;

  @ApiPropertyOptional({
    description: "religion",
    enum: ReligionEnum,
    default: ReligionEnum.BUDDHISM,
  })
  @IsOptional()
  @IsString()
  @IsEnum(ReligionEnum)
  religion?: ReligionEnum;

  @ApiPropertyOptional({ description: "height" })
  @IsOptional()
  @IsNumberString()
  height?: number;

  @ApiPropertyOptional({
    description: "maritalStatus",
    enum: MaritalStatusEnum,
    default: MaritalStatusEnum.SINGLE,
  })
  @IsOptional()
  @IsString()
  @IsEnum(MaritalStatusEnum)
  maritalStatus?: MaritalStatusEnum;

  @ApiPropertyOptional({
    description: "education",
    enum: EducationEnum,
    default: EducationEnum.COLLEGE,
  })
  @IsOptional()
  @IsString()
  @IsEnum(EducationEnum)
  education?: EducationEnum;

  @ApiPropertyOptional({ description: "purposeId" })
  @IsOptional()
  @IsUUID()
  purposeId?: string;

  @ApiPropertyOptional({
    description: "type of update",
    enum: UpdateUserProfileEnum,
    default: UpdateUserProfileEnum.HEIGHT,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(UpdateUserProfileEnum)
  type: UpdateUserProfileEnum;
}
