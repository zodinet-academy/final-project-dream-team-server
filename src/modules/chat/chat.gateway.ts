import {
  ConnectedSocket,
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

import { SendMessageDto } from "./dto";
import { ResponseDto } from "../../common/response.dto";

import { ConversationEntity } from "./entities/conversations.entity";
import { SocketDeviceEntity } from "./entities/socket-devices.entity";

import { ChatService } from "./chat.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

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
    private readonly cloudinaryService: CloudinaryService
  ) {}

  afterInit(): void {
    console.log("Init Server Socket - Port 3006");
  }

  // Handle Connect Chat
  async handleConnection(client: Socket) {
    console.log("Connect Success Websocket - Port 3006");
    const { userId } = client.handshake?.query;
    const socketId = client.id;

    try {
      const device = await this.createDevice(userId as string, socketId);

      return device;
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  // Handle Disconnect Chat
  async handleDisconnect(client: Socket) {
    console.log("Disconnect Success Websocket - Port 3006");
    const { userId } = client.handshake?.query;

    try {
      const deleteSocketDevice = await this.chatService.deleteSocketDevice(
        userId as string
      );

      return deleteSocketDevice;
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
        const conversation = await this.createConversation(
          payload.senderId,
          payload.friendId
        );

        if (conversation.status) {
          messageEntity.conversationId = conversation.data.id;
        }
      }

      if (messageEntity.conversationId) {
        const message = await this.chatService.createMessage(messageEntity);
        const device = await this.chatService.getSocketDeviceByUserId(
          payload.friendId
        );

        if (message.status && device.status) {
          const image = await this.cloudinaryService.getImageUrl(
            message.data.image
          );
          const messageReceived = {
            content: messageEntity.content ?? "",
            image: image ?? "",
            senderId: messageEntity.senderId,
          };

          const emit = this.server;
          emit.to(client.id).emit("message-received", messageReceived);
          emit
            .to(device.data.socketId)
            .emit("message-received", messageReceived);
        }
      }
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  // Handle Create New Conversation
  async createConversation(
    userId: string,
    friendId: string
  ): Promise<ResponseDto<ConversationEntity | null>> {
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
    userId: string,
    socketId: string
  ): Promise<ResponseDto<SocketDeviceEntity | boolean | null>> {
    try {
      const deviceEntity = {
        userId,
        socketId,
      };

      const device = await this.chatService.createSocketDevice(deviceEntity);

      return device;
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }
}
