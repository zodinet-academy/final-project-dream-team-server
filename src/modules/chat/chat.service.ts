import { HttpStatus, Injectable } from "@nestjs/common";

import { ConversationRepository, MessageRepository } from "./chat.repository";

import { responseData } from "../../common/utils";
import {
  ERROR_DATA_NOT_FOUND,
  ERROR_UNKNOWN,
} from "./../../constants/code-response.constant";

import { MessageEntity } from "./entities/messages.entity";
import { ConversationEntity } from "./entities/conversations.entity";

import { ConnectChatDto, SendMessageDto } from "./dto";
import { ResponseDto } from "../../common/response.dto";

import {
  IChatService,
  IConversation,
  IConversationMessage,
} from "./interfaces";

import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Injectable()
export class ChatService implements IChatService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private readonly cloudinaryService: CloudinaryService
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

      message.length !== 0 &&
        message.map(async (item) => {
          if (item.image) {
            item.image = await this.cloudinaryService.getImageUrl(item.image);
          }
        });

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

      conversations.map(async (conversation) => {
        conversation.avatar = await this.cloudinaryService.getImageUrl(
          conversation.avatar
        );
      });

      return responseData(conversations);
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
      const messageCover = {
        ...message,
        image: "",
      };

      if (message.image) {
        await this.cloudinaryService
          .uploadImage(message.image, "messages")
          .then((data) => {
            messageCover.image = data.public_id;
          })
          .catch((error) => {
            console.log("alo");

            return responseData(null, error.message, HttpStatus.BAD_REQUEST);
          });
      }

      const messageEntity = await this.messageRepository.save(messageCover);

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
