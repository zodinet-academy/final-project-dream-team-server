import { MessageEntity } from "../entities/messages.entity";
import { ConversationEntity } from "../entities/conversations.entity";
import { SocketDeviceEntity } from "../entities/socket-devices.entity";

import { ConnectChatDto } from "../dto/connect-chat.dto";
import { SendMessageDto } from "../dto/send-message.dto";
import { CreateDeviceDto } from "../dto/create-device.dto";
import { ResponseDto } from "../../../common/response.dto";

export interface IChatService {
  getConversationById(
    userId: string,
    friendId: string
  ): Promise<ResponseDto<ConversationEntity | null>>;
  getSocketDeviceByConversationId(
    conversationId: string
  ): Promise<ResponseDto<SocketDeviceEntity[] | null>>;

  createConversation(
    conversation: ConnectChatDto
  ): Promise<ResponseDto<ConversationEntity | null>>;
  createMessage(
    message: SendMessageDto
  ): Promise<ResponseDto<MessageEntity | null>>;
  createDevice(
    device: CreateDeviceDto
  ): Promise<ResponseDto<SocketDeviceEntity | null>>;

  deleteConversation(
    user_id: string,
    friend_id: string
  ): Promise<ResponseDto<boolean | null>>;
}
