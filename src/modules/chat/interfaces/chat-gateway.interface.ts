import { ResponseDto } from "../../../common/response.dto";

import { ConversationEntity } from "../entities/conversations.entity";
import { SocketDeviceEntity } from "../entities/socket-devices.entity";

export interface IChatGateway {
  createConversation(
    userId: string,
    friendId: string
  ): Promise<ResponseDto<ConversationEntity | null>>;
  createDevice(
    userId: string,
    socketId: string
  ): Promise<ResponseDto<SocketDeviceEntity | boolean | null>>;
}
