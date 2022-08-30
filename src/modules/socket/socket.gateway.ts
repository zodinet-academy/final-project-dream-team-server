import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { responseData } from "../../common/utils";
import { ISocketGateway } from "./interfaces/socket-gateway.interface";
import { ERROR_INTERNAL_SERVER } from "../../constants/code-response.constant";

import { SendMessageDto } from "../chat/dto";
import { ResponseDto } from "../../common/response.dto";

import { ConversationEntity } from "../chat/entities/conversations.entity";
import { NotificationEntity } from "../notifications/entities/notification.entity";

import { ChatService } from "../chat/chat.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { NotificationsService } from "../notifications/notifications.service";

@WebSocketGateway(3006, { cors: true })
export class SocketGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ISocketGateway {
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
    console.log("Connect Success Websocket - Port 3006", client.id);
  }

  // Handle Disconnect Chat
  async handleDisconnect(client: Socket) {
    console.log("Disconnect Success Websocket - Port 3006", client.id);
  }

  // Handle Send & Receive Message
  @SubscribeMessage("send-message")
  async messages(client: Socket, payload: SendMessageDto) {
    try {
      const messageEntity = payload;
      const isGetConversation = payload.conversationId === "" ? true : false;

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

        if (message.status) {
          if (message.data.image) {
            const image = await this.cloudinaryService.getImageUrl(
              message.data.image
            );

            message.data.image = image;
          }

          const emit = this.server;
          emit.emit(`message-received-${payload.senderId}`, message.data);
          emit.emit(`message-received-${payload.friendId}`, message.data);
          emit.emit(`message-notification-${payload.friendId}`, message.data);

          if (isGetConversation) {
            emit.emit(`conversation-received-${payload.senderId}`, null);
            emit.emit(`conversation-received-${payload.friendId}`, null);
          } else {
            emit.emit(
              `conversation-received-${payload.senderId}`,
              message.data
            );
            emit.emit(
              `conversation-received-${payload.friendId}`,
              message.data
            );
          }
        }
      }
    } catch (error) {
      return responseData(null, error.message, ERROR_INTERNAL_SERVER);
    }
  }

  // Handle Send Notification
  async sendNotifications(userId: string, notification: NotificationEntity) {
    try {
      const emit = this.server;
      emit.emit(`notification-received-${userId}`, notification);
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
}
