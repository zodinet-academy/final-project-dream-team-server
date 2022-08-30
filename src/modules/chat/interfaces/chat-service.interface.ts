import { MessageEntity } from "../entities/messages.entity";
import { ConversationEntity } from "../entities/conversations.entity";

import { ConnectChatDto } from "../dto/connect-chat.dto";
import { SendMessageDto } from "../dto/send-message.dto";
import { ResponseDto } from "../../../common/response.dto";

import {
  IConversationMessage,
  IConversation,
} from "./chat-repository.interface";

export interface IChatService {
  getConversationByUserIdAndFriendId(
    userId: string,
    friendId: string
  ): Promise<ResponseDto<ConversationEntity | null>>;
  getConversationContentByUserIdAndFriendId(
    userId: string,
    friendId: string
  ): Promise<ResponseDto<IConversation | null>>;
  getConversationByUserId(
    friendId: string
  ): Promise<ResponseDto<IConversationMessage[] | null>>;

  createConversation(
    conversation: ConnectChatDto
  ): Promise<ResponseDto<ConversationEntity | null>>;
  createMessage(
    message: SendMessageDto
  ): Promise<ResponseDto<MessageEntity | null>>;

  deleteConversation(
    userId: string,
    friendId: string
  ): Promise<ResponseDto<boolean | null>>;
}
