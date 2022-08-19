import { EntityRepository, Repository } from "typeorm";

import { MessageEntity } from "./entities/messages.entity";
import { ConversationEntity } from "./entities/conversations.entity";
import { SocketDeviceEntity } from "./entities/socketDevices.entity";

import {
  IConversationMessage,
  IUserFriend,
  IMessage,
  IChatRepository,
} from "./interfaces";

@EntityRepository(ConversationEntity)
export class ConversationRepository
  extends Repository<ConversationEntity>
  implements IChatRepository {
  async getConversationsByUserId(
    userId: string
  ): Promise<IConversationMessage[]> {
    const conversations = await this.createQueryBuilder("C")
      .leftJoinAndSelect("C.infoFriend", "infoFriend")
      .leftJoinAndSelect("C.messages", "messages")
      .andWhere(`C.user_id = '${userId}' OR C.friend_id = '${userId}'`)
      .select([
        `C.id as "conversationId", C.friend_id as "friendId", infoFriend.name as name, infoFriend.avatar as avatar, messages.content as content, messages.created_at as "createAt"`,
      ])
      .orderBy("messages.created_at", "DESC")
      .limit(1)
      .getRawMany<IConversationMessage>();

    return conversations;
  }

  async getFriendByConversationId(
    conversationId: string
  ): Promise<IUserFriend> {
    const infoFriend = await this.createQueryBuilder("C")
      .leftJoinAndSelect("C.infoFriend", "infoFriend")
      .andWhere(`C.id = '${conversationId}'`)
      .select([
        `infoFriend.id as "userId", infoFriend.name as name, infoFriend.avatar as avatar, C.created_at as "createAt"`,
      ])
      .getRawOne<IUserFriend>();

    return infoFriend;
  }

  async getMessagesByConversationId(
    conversationId: string
  ): Promise<IMessage[]> {
    const messages = await this.createQueryBuilder("C")
      .leftJoinAndSelect("C.messages", "messages")
      .andWhere(`C.id = '${conversationId}'`)
      .select([
        `messages.id as "messageId", messages.sender_id as "senderId", messages.content as content, messages.image as image, messages.created_at as "createAt"`,
      ])
      .orderBy("messages.created_at", "DESC")
      .getRawMany<IMessage>();

    return messages;
  }
}

@EntityRepository(MessageEntity)
export class MessageRepository extends Repository<MessageEntity> {}

@EntityRepository(SocketDeviceEntity)
export class SocketDeviceRepository extends Repository<SocketDeviceEntity> {}
