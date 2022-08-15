import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { JwtService } from "@nestjs/jwt";
import { Server, Socket } from "socket.io";

import { ChatService } from "./chat.service";

@WebSocketGateway(3006, { cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(private readonly chatService: ChatService) {}

  afterInit(): void {
    console.log("Init Server Socket - Port 3006");
  }

  // Handle Connect Chat
  async handleConnection(client: Socket) {
    console.log("a");
  }

  // Handle Disconnect Chat
  async handleDisconnect() {
    console.log("disconnect");
  }

  @SubscribeMessage("send-message")
  async messages() {
    console.log("a");
  }

  private async createConversation() {
    console.log("a");
  }

  private async createDevice() {
    console.log("a");
  }
}
