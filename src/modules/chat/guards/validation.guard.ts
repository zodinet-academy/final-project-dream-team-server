import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";
import { UsersService } from "../../users/users.service";

@Injectable()
export class WebSocketGuard implements CanActivate {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean | any | Promise<boolean | any>> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const authToken: any = client.handshake?.query?.token;
    try {
      const decoded = this.jwtService.verify(authToken);
      const user = await this.userService.getUserByEmail(decoded.email);
      context.switchToWs().getData().user = user;

      return user;
    } catch (ex) {
      return false;
    }
  }
}
