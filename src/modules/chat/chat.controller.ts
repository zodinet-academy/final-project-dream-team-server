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
import { HttpException, HttpStatus, Logger } from "@nestjs/common";

import { ChatService } from "./chat.service";
import { UsersService } from "../users/users.service";
import { JwtPayload } from "../auth/interfaces/jwt-payload.interfact";
import { ConversationEntity } from "./entities/conversation.entity";
import { UserEntity } from "../users/entities/user.entity";
import { CreateMessageDto } from "./dto/create-message.dto";

@WebSocketGateway(3006, { cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("MessageGateway");
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly chatService: ChatService
  ) {}

  afterInit(server: any): void {
    this.logger.log(server, "Init Server Socket - Port 3006");
  }

  async handleConnection(client: Socket): Promise<ConversationEntity> {
    this.logger.log(client.id, "Connected..............................");

    const user: UserEntity | any = await this.getDataUserFromToken(client);

    const conversationEntity = {
      user_id: user.id,
      friend_id: "a",
      socket_id: "a",
    };

    const conversation = await this.chatService.createConversation(
      conversationEntity
    );

    return conversation;
  }

  async handleDisconnect(client: Socket) {
    const user = await this.getDataUserFromToken(client);
    await this.chatService.deleteConversation("user_id", "friend_id");
    this.logger.log(client.id, "Disconnect");
  }

  @SubscribeMessage("messages")
  async messages(client: Socket, payload: CreateMessageDto) {
    const conversation = await this.chatService.findConversationById(
      "user_id",
      "friend_id"
    );

    // const userId = [];
    // conversation.users.map((user) => {
    //   userId.push(user.id);

    //   return user;
    // });

    // const dataSocketId = await this.informationService.findSocketId(userId);

    const message = await this.chatService.createMessage(payload);

    // const dataUserConversation =
    //   await this.userConversationService.findDataUserConversation(
    //     message.user_id,
    //     message.conversation_id,
    //   );

    // const messageId =
    //   typeof message.id === 'string' ? parseInt(message.id) : message.id;

    // await this.userConversationService.updateLastMessageId(
    //   dataUserConversation,
    //   messageId,
    // );

    // const emit = this.server;
    // dataSocketId.map((value) => {
    //   emit.to(value.value).emit('message-received', {
    //     id: message.id,
    //     message: message.message,
    //     conversation_id: message.conversation_id,
    //     user_id: message.user_id,
    //     status: message.status,
    //     createdAt: message.createdAt,
    //     updatedAt: message.updatedAt,
    //   });
    // });

    const emit = this.server;
    emit.to(conversation.socket_id).emit("message-received", payload);
  }

  private async getDataUserFromToken(client: Socket): Promise<UserEntity> {
    const authToken: string | string[] | any = client.handshake?.query?.token;

    try {
      const decoded: JwtPayload = this.jwtService.verify(authToken);

      return await this.usersService.getUserByPhone(decoded.phone);
    } catch (error: unknown) {
      throw new HttpException("Not found", HttpStatus.NOT_FOUND);
    }
  }
}
