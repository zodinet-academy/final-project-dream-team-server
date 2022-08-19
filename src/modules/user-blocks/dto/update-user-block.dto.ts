import { PartialType } from "@nestjs/swagger";
import { CreateUserBlockDto } from "./create-user-block.dto";

export class UpdateUserBlockDto extends PartialType(CreateUserBlockDto) {}
