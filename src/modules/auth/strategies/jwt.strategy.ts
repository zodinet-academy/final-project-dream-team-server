import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/modules/users/users.service";
import { JwtPayload } from "../interfaces/jwt-payload.interfact";

@Injectable()
export class JwtStragegy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly userService: UsersService,
    config: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("JWT_SECRET"),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.getUserByPhone(payload.phone);
    return user;
  }
}
