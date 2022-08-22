import { HttpStatus, Injectable } from "@nestjs/common";

import {
  ConversationRepository,
  MessageRepository,
  SocketDeviceRepository,
} from "./chat.repository";

import { responseData } from "../../common/utils";
import {
  ERROR_DATA_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  ERROR_UNKNOWN,
} from "./../../constants/code-response.constant";

import { MessageEntity } from "./entities/messages.entity";
import { ConversationEntity } from "./entities/conversations.entity";
import { SocketDeviceEntity } from "./entities/socket-devices.entity";

import { ResponseDto } from "../../common/response.dto";
import { ConnectChatDto, SendMessageDto, CreateDeviceDto } from "./dto";

import {
  IChatService,
  IConversationMessage,
  IConversation,
} from "./interfaces";

@Injectable()
export class ChatService implements IChatService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private readonly socketDeviceRepository: SocketDeviceRepository
  ) {}

  async getConversationByUserIdAndFriendId(
    userId: string,
    friendId: string
  ): Promise<ResponseDto<ConversationEntity | null>> {
    try {
      const conversationEntity = await this.conversationRepository.findOne({
        where: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId },
        ],
      });

      if (!conversationEntity) {
        return responseData(
          null,
          "Conversation Not Found",
          ERROR_DATA_NOT_FOUND
        );
      }

      return responseData(conversationEntity);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async getConversationContentByUserIdAndFriendId(
    userId: string,
    friendId: string
  ): Promise<ResponseDto<IConversation | null>> {
    try {
      const conversationEntity = await this.conversationRepository.findOne({
        where: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId },
        ],
      });

      const conversation: IConversation = {
        id: conversationEntity?.id ?? "",
        messages: [],
      };

      if (!conversationEntity) {
        return responseData(
          conversation,
          "Conversation Not Found",
          ERROR_DATA_NOT_FOUND
        );
      }

      const message = await this.conversationRepository.getMessagesByConversationId(
        conversationEntity.id
      );

      conversation.messages = message;

      return responseData(conversation);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async getConversationByUserId(
    userId: string
  ): Promise<ResponseDto<IConversationMessage[] | null>> {
    try {
      const conversations = await this.conversationRepository.getConversationsByUserId(
        userId
      );

      if (conversations.length === 0) {
        return responseData([], "Not Found Conversation", ERROR_DATA_NOT_FOUND);
      }

      return responseData(conversations);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async getSocketDeviceByConversationId(
    conversationId: string
  ): Promise<ResponseDto<SocketDeviceEntity[] | null>> {
    try {
      const socketDeviceEntity = await this.socketDeviceRepository.find({
        conversationId,
      });

      if (socketDeviceEntity.length === 0) {
        return responseData(
          null,
          "Not Found Conversation",
          ERROR_DATA_NOT_FOUND
        );
      }

      return responseData(socketDeviceEntity);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async getSocketDeviceByConversationIdAndUserId(
    conversationId: string,
    userId: string
  ): Promise<ResponseDto<SocketDeviceEntity | null>> {
    try {
      const socketDeviceEntity = await this.socketDeviceRepository.findOne({
        conversationId,
        userId,
      });

      if (socketDeviceEntity) {
        return responseData(socketDeviceEntity);
      }

      return responseData(
        null,
        "Not Found Socket Device",
        ERROR_DATA_NOT_FOUND
      );
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
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
      return responseData(null, error.message, ERROR_UNKNOWN);
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
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async createSocketDevice(
    device: CreateDeviceDto
  ): Promise<ResponseDto<SocketDeviceEntity | null>> {
    try {
      const deviceEntity = await this.socketDeviceRepository.save(device);

      if (deviceEntity) {
        return responseData(deviceEntity);
      }

      return responseData(null, "Created Device Failed", ERROR_INTERNAL_SERVER);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async updateSocketDevice(
    device: CreateDeviceDto
  ): Promise<ResponseDto<boolean | null>> {
    try {
      const deviceEntity = await this.socketDeviceRepository.update(
        { userId: device.userId, conversationId: device.conversationId },
        { socketId: device.socketId }
      );

      if (deviceEntity.affected > 0) {
        return responseData(true, "Update Socket Device Success");
      }

      return responseData(
        false,
        "Update Socket Device Failed",
        ERROR_INTERNAL_SERVER
      );
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async deleteSocketDevice(
    socketId: string
  ): Promise<ResponseDto<boolean | null>> {
    try {
      const device = await this.socketDeviceRepository.delete({
        socketId,
      });

      if (device.affected > 0) {
        return responseData(true, "Delete Socket Device Success");
      }

      return responseData(
        false,
        "Delete Socket Device Failed",
        ERROR_INTERNAL_SERVER
      );
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }

  async deleteConversation(
    userId: string,
    friendId: string
  ): Promise<ResponseDto<boolean | null>> {
    try {
      const deleteConversation = await this.conversationRepository.delete({
        userId,
        friendId,
      });

      if (deleteConversation.affected > 0) {
        return responseData(true);
      }

      return responseData(null, "Delete Conversation Failed", ERROR_UNKNOWN);
    } catch (error) {
      return responseData(null, error.message, ERROR_UNKNOWN);
    }
  }
}
