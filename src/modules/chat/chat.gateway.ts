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
import { ERROR_UNKNOWN } from "../../constants/code-response.constant";

import { ResponseDto } from "../../common/response.dto";
import { SendMessageDto, CreateSocketDeviceDto } from "./dto";

import { ConversationEntity } from "./entities/conversations.entity";
import { SocketDeviceEntity } from "./entities/socket-devices.entity";

import { ChatService } from "./chat.service";

@WebSocketGateway(3006, { cors: true })
export class ChatGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    IChatGateway {
  @WebSocketServer() server: Server;
  constructor(private readonly chatService: ChatService) {}

  afterInit(): void {
    console.log("Init Server Socket - Port 3006");
  }

  // Handle Connect Chat
  async handleConnection() {
    console.log("Connect Success Websocket - Port 3006");
  }

  // Handle Disconnect Chat
  async handleDisconnect(client: Socket) {
    console.log("Disconnect Success Websocket - Port 3006");

    try {
      const socketId: string = client.id;
      const deleteSocketDevice = await this.chatService.deleteSocketDevice(
        socketId
      );

      return deleteSocketDevice;
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  @SubscribeMessage("create-socket-device")
  async handleCreateSocketDevice(
    client: Socket,
    payload: CreateSocketDeviceDto
  ) {
    try {
      const device = await this.createDevice(client, payload.conversationId);

      return device;
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  // Handle Send & Receive Message
  @SubscribeMessage("send-message")
  async messages(client: Socket, payload: SendMessageDto) {
    try {
      const messageEntity: SendMessageDto = {
        ...payload,
      };

      if (!payload.conversationId) {
        const conversation = await this.createConversation(client);

        if (conversation.status) {
          messageEntity.conversationId = conversation.data.id;
        }
      }

      if (messageEntity.conversationId) {
        const message = await this.chatService.createMessage(messageEntity);

        if (message.status) {
          const devices = await this.chatService.getSocketDeviceByConversationId(
            messageEntity.conversationId
          );

          const messageReceived = {
            content: messageEntity.content,
            image: messageEntity.image ?? "",
            senderId: messageEntity.senderId,
          };

          const emit = this.server;
          devices.data.map((device) => {
            emit.to(device.socketId).emit("message-received", messageReceived);
          });
        }
      }
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  // Handle Create New Conversation
  async createConversation(
    client: Socket
  ): Promise<ResponseDto<ConversationEntity | null>> {
    const { userId, friendId }: any = client.handshake?.query;

    try {
      const conversation = await this.chatService.getConversationByUserIdAndFriendId(
        userId,
        friendId
      );

      if (!conversation.status) {
        const conversationEntity = {
          userId,
          friendId,
        };

        const createConversation = await this.chatService.createConversation(
          conversationEntity
        );

        return createConversation;
      }

      return conversation;
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  // Handle Create New Socket Device When Connect
  async createDevice(
    client: Socket,
    conversationId: string
  ): Promise<ResponseDto<SocketDeviceEntity | null>> {
    const { userId }: any = client.handshake?.query;
    const socketId: string = client.id;

    try {
      const deviceEntity = {
        userId,
        conversationId,
        socketId,
      };

      const socketDevice = await this.chatService.getSocketDeviceByConversationIdAndUserId(
        conversationId,
        userId
      );

      if (!socketDevice.status) {
        const device = await this.chatService.createSocketDevice(deviceEntity);

        return device;
      }

      return socketDevice;
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }
}
