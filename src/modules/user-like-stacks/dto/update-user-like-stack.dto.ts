import { PartialType } from "@nestjs/swagger";
import { CreateUserLikeStackDto } from "./create-user-like-stack.dto";

export class UpdateUserLikeStackDto extends PartialType(
  CreateUserLikeStackDto
) {}
