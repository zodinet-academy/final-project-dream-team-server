import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { IChatGateway } from "./interfaces";
import { responseData } from "../../common/utils";
import { ERROR_UNKNOW } from "../../constants/code-response.constant";

import { SendMessageDto } from "./dto";
import { ResponseDto } from "../../common/response.dto";

import { ConversationEntity } from "./entities/conversations.entity";
import { SocketDeviceEntity } from "./entities/socket-devices.entity";

import { ChatService } from "./chat.service";
import { UsersService } from "../users/users.service";

@WebSocketGateway(3006, { cors: true })
export class ChatGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    IChatGateway {
  @WebSocketServer() server: Server;
  constructor(
    private readonly chatService: ChatService,
    private readonly usersService: UsersService
  ) {}

  afterInit(): void {
    console.log("Init Server Socket - Port 3006");
  }

  // Handle Connect Chat
  async handleConnection() {
    console.log("Connect Success Websocket - Port 3006");
  }

  // Handle Disconnect Chat
  async handleDisconnect() {
    console.log("Disconnect Success Websocket - Port 3006");
  }

  // Handle Send & Receive Message
  @SubscribeMessage("send-message")
  async messages(client: Socket, payload: SendMessageDto) {
    try {
      const messageEntity: SendMessageDto = {
        ...payload,
      };

      const message = await this.chatService.createMessage(messageEntity);

      if (message) {
        const user = await this.usersService.getPublicById(
          message.data.sender_id
        );
        const devices = await this.chatService.getSocketDeviceByConversationId(
          payload.conversation_id
        );

        const messageReceived = {
          name: user.data.name,
          avatar: user.data.avatar,
          content: payload.content,
          image: payload.image,
          sender_id: payload.sender_id,
        };

        const emit = this.server;
        devices.data.map((device) => {
          emit.to(device.socket_id).emit("message-received", messageReceived);
        });
      }
    } catch (error: unknown) {
      console.log(error);
    }
  }

  // Handle Create New Conversation
  async createConversation(
    client: Socket
  ): Promise<ResponseDto<ConversationEntity | string | null>> {
    const { userId, friendId }: any = client.handshake?.query;

    try {
      const conversation = await this.chatService.getConversationById(
        userId,
        friendId
      );

      if (!conversation) {
        const conversationEntity = {
          user_id: userId,
          friend_id: friendId,
        };

        const createConversation = await this.chatService.createConversation(
          conversationEntity
        );

        return createConversation;
      }

      return conversation;
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOW);
    }
  }

  // Handle Create New Socket Device When Connect
  async createDevice(
    client: Socket,
    conversationId: string
  ): Promise<ResponseDto<SocketDeviceEntity | string | null>> {
    const { userId }: any = client.handshake?.query;
    const socketId: string = client.id;

    try {
      const deviceEntity = {
        user_id: userId,
        conversation_id: conversationId,
        socket_id: socketId,
      };
      const device = await this.chatService.createDevice(deviceEntity);

      return device;
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOW);
    }
  }
}
