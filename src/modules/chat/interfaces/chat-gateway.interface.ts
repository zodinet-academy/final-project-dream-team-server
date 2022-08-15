import { Socket } from "socket.io";

import { ResponseDto } from "../../../common/response.dto";

import { ConversationEntity } from "../entities/conversations.entity";
import { SocketDeviceEntity } from "../entities/socket-devices.entity";

export interface IChatGateway {
  createConversation(
    client: Socket
  ): Promise<ResponseDto<ConversationEntity | string | null>>;
  createDevice(
    client: Socket,
    conversationId: string
  ): Promise<ResponseDto<SocketDeviceEntity | string | null>>;
}
