import { HttpStatus, Injectable } from "@nestjs/common";

import {
  ConversationRepository,
  MessageRepository,
  SocketDeviceRepository,
} from "./chat.repository";

import { responseData } from "../../common/utils";
import { ERROR_UNKNOW } from "./../../constants/code-response.constant";

import { MessageEntity } from "./entities/messages.entity";
import { ConversationEntity } from "./entities/conversations.entity";
import { SocketDeviceEntity } from "./entities/socket-devices.entity";

import { ResponseDto } from "../../common/response.dto";
import { ConnectChatDto, SendMessageDto, CreateDeviceDto } from "./dto";

import { IChatService } from "./interfaces";

@Injectable()
export class ChatService implements IChatService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private readonly socketDeviceRepository: SocketDeviceRepository
  ) {}

  async getConversationById(
    userId: string,
    friendId: string
  ): Promise<ResponseDto<ConversationEntity | null>> {
    try {
      const conversationEntity = await this.conversationRepository.findOne({
        where: [
          { user_id: userId, friend_id: friendId },
          { user_id: friendId, friend_id: userId },
        ],
      });

      return responseData(conversationEntity);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOW);
    }
  }

  async getSocketDeviceByConversationId(
    conversationId: string
  ): Promise<ResponseDto<SocketDeviceEntity[] | null>> {
    try {
      const socketDeviceEntity = await this.socketDeviceRepository.find({
        conversation_id: conversationId,
      });

      return responseData(socketDeviceEntity);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOW);
    }
  }

  async createConversation(
    conversation: ConnectChatDto
  ): Promise<ResponseDto<ConversationEntity | null>> {
    try {
      const conversationEntity = await this.conversationRepository.save(
        conversation
      );

      if (conversationEntity) {
        return responseData(conversationEntity);
      }

      return responseData(
        null,
        "Create Conversation Failed",
        HttpStatus.BAD_REQUEST
      );
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOW);
    }
  }

  async createMessage(
    message: SendMessageDto
  ): Promise<ResponseDto<MessageEntity | null>> {
    try {
      const messageEntity = await this.messageRepository.save(message);

      if (messageEntity) {
        return responseData(messageEntity);
      }

      return responseData(
        null,
        "Create Message Failed",
        HttpStatus.BAD_REQUEST
      );
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOW);
    }
  }

  async createDevice(
    device: CreateDeviceDto
  ): Promise<ResponseDto<SocketDeviceEntity | null>> {
    try {
      const deviceEntity = await this.socketDeviceRepository.save(device);

      if (deviceEntity) {
        return responseData(deviceEntity);
      }

      return responseData(
        null,
        "Created Device Failed",
        HttpStatus.BAD_REQUEST
      );
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOW);
    }
  }

  async deleteConversation(
    user_id: string,
    friend_id: string
  ): Promise<ResponseDto<boolean | null>> {
    try {
      const deleteConversation = await this.conversationRepository.delete({
        user_id,
        friend_id,
      });

      if (deleteConversation.affected > 0) {
        return responseData(true);
      }

      return responseData(false);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOW);
    }
  }
}
