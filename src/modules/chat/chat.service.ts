import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ConversationEntity } from "./entities/conversation.entity";
import { MessageEntity } from "./entities/message.entity";
import { CreateMessageDto } from "./dto/create-message.dto";
import { ConnectChatDto } from "./dto/connnect-chat.dto";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ConversationEntity)
    private conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(MessageEntity)
    private messagesRepository: Repository<MessageEntity>
  ) {}

  async findConversationById(
    user_id: string,
    friend_id: string
  ): Promise<ConversationEntity> {
    const conversationEntity = await this.conversationRepository.findOne({
      user_id,
      friend_id,
    });

    if (conversationEntity) {
      return conversationEntity;
    }

    throw new HttpException(
      "Create Conversation Failed",
      HttpStatus.BAD_REQUEST
    );
  }

  async createConversation(
    conversation: ConnectChatDto
  ): Promise<ConversationEntity> {
    const conversationEntity = await this.conversationRepository.save(
      conversation
    );

    if (conversationEntity) {
      return conversationEntity;
    }

    throw new HttpException(
      "Create Conversation Failed",
      HttpStatus.BAD_REQUEST
    );
  }

  async createMessage(message: CreateMessageDto): Promise<MessageEntity> {
    const messageEntity = await this.messagesRepository.save(message);

    if (messageEntity) {
      return messageEntity;
    }

    throw new HttpException(
      "Create Conversation Failed",
      HttpStatus.BAD_REQUEST
    );
  }

  async deleteConversation(
    user_id: string,
    friend_id: string
  ): Promise<boolean> {
    const deleteConversation = await this.conversationRepository.delete({
      user_id,
      friend_id,
    });

    if (deleteConversation.affected > 0) {
      return true;
    }
    return false;
  }
}
