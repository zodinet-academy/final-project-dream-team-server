import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

export class PhoneUserDto extends PickType(CreateUserDto, ["phone"]) {}
