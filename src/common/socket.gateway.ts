import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { responseData } from "./utils";
import { IChatGateway } from "../modules/chat/interfaces";
import { ERROR_INTERNAL_SERVER } from "../constants/code-response.constant";

import { SendMessageDto } from "../modules/chat/dto";

import { ConversationEntity } from "../modules/chat/entities/conversations.entity";
import { SocketDeviceEntity } from "../modules/chat/entities/socket-devices.entity";
import { NotificationEntity } from "./../modules/notifications/entities/notification.entity";

import { ChatService } from "../modules/chat/chat.service";
import { CloudinaryService } from "../modules/cloudinary/cloudinary.service";
import { NotificationsService } from "./../modules/notifications/notifications.service";
import { ResponseDto } from "./response.dto";

@WebSocketGateway(3006, { cors: true })
export class SocketGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    IChatGateway {
  @WebSocketServer() server: Server;
  constructor(
    private readonly chatService: ChatService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly notificationService: NotificationsService
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
      return responseData(null, error.message, ERROR_INTERNAL_SERVER);
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
      return responseData(null, error.message, ERROR_INTERNAL_SERVER);
    }
  }

  // Handle Send & Receive Message
  @SubscribeMessage("send-message")
  async messages(client: Socket, payload: SendMessageDto) {
    try {
      const messageEntity = payload;
      console.log("payload", payload, client.id, new Date());

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

        if (message.status) {
          if (message.data.image) {
            const image = await this.cloudinaryService.getImageUrl(
              message.data.image
            );

            message.data.image = image;
          }

          const emit = this.server;
          emit.to(client.id).emit("message-received", message.data);

          if (device.status) {
            emit
              .to(device.data.socketId)
              .emit("message-received", message.data);
          }
        }
      }
    } catch (error) {
      return responseData(null, error.message, ERROR_INTERNAL_SERVER);
    }
  }

  // Handle Send Notification
  async sendnotifications(userId: string, notification: NotificationEntity) {
    try {
      const device = await this.chatService.getSocketDeviceByUserId(userId);

      if (device.status) {
        const emit = this.server;
        emit.emit(`notification-received-${userId}`, notification);
      }
    } catch (error) {
      return responseData(null, error.message, ERROR_INTERNAL_SERVER);
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
      return responseData(null, error.message, ERROR_INTERNAL_SERVER);
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
      return responseData(null, error.message, ERROR_INTERNAL_SERVER);
    }
  }
}
