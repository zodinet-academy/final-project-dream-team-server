import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MatchingUsersService } from "./matching-users.service";

@ApiTags("matching-users")
@Controller("matching-users")
export class MatchingUsersController {
  constructor(private matchingUsersService: MatchingUsersService) {}
}
